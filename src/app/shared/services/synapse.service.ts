import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, lastValueFrom, map, Observable, switchMap, take, tap } from 'rxjs';
import { Message } from '../models/message.model';
import { Timeline } from '../models/timeline.model';

@Injectable({
  providedIn: 'root'
})
export class SynapseService {

  constructor(private http: HttpClient) { }

  // access_token!: string;
  newTimeline!: Message[];

  access_token!: string;

  private _roomName$ = new BehaviorSubject<string>("");
  get roomName$(): Observable<string> {
    return this._roomName$.asObservable();
  }

  private _roomTopic$ = new BehaviorSubject<string>("");
  get roomTopic$(): Observable<string> {
    return this._roomTopic$.asObservable();
  }

  private _roomAvatarUrl$ = new BehaviorSubject<string>("");
  get roomAvatarUrl$(): Observable<string> {
    return this._roomAvatarUrl$.asObservable();
  }


  private _timeline$ = new BehaviorSubject<Message[]>([]);
  get timeline$(): Observable<Message[]> {
    return this._timeline$.asObservable();
  }

  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _accessToken$ = new BehaviorSubject<string>("");
  get accessToken$(): string {
    return this._accessToken$.getValue();
  }

  private _endToken$ = new BehaviorSubject<string>("");
  get endToken$(): string {
    return this._endToken$.getValue();
  }

  private _homeserver$ = new BehaviorSubject<string>("");
  get homeserver$(): string {
    return this._homeserver$.getValue();
  }

  private _roomId$ = new BehaviorSubject<string>("");
  get roomId$(): string {
    return this._roomId$.getValue();
  }

  private _mediaGallery$ = new BehaviorSubject<boolean>(false);
  get mediaGallery$(): boolean {
    return this._mediaGallery$.getValue();
  }

  private _carousel$ = new BehaviorSubject<boolean>(false);
  get carousel$(): boolean {
    return this._carousel$.getValue();
  }

  private _fromStart$ = new BehaviorSubject<boolean>(false);
  get fromStart$(): boolean {
    return this._fromStart$.getValue();
  }




  async getAccessTokenForGuest(homeserver: string) {
    if (this.accessToken$) return this.accessToken$;
    else {
      let request = this.http.post<{ access_token: string }>(`https://${homeserver}/_matrix/client/v3/register?kind=guest`, { initial_device_display_name: "matrix-component" }).pipe(
        tap((response) => this.setAccessToken(response.access_token)),
      );
      let token = await firstValueFrom(request);
      return token.access_token;

    }
  }

  fetchTimeLine() {
    let direction = this.fromStart$ ? `&dir=f` : `&dir=b`;
    let filters = `{"types":["m.room.message"]}`;
    let from = (this.endToken$ ? `&from=${this.endToken$}` : '');

    return this.http.get<Timeline>(`https://${this.homeserver$}/_matrix/client/v3/rooms/${this.roomId$}/messages?access_token=${this.accessToken$}${direction}${from}&filter=${filters}`);
  }

  async firstTimelineSync() {
    await this.getAccessTokenForGuest(this.homeserver$);
    if (this.fromStart$) this.setEndToken("t0-0");
    else this.setEndToken("");
    this.getRoomState().pipe(
      tap((state) => {
        this.setRoomName(this.getStateFromRequest(state, "m.room.name").name),
          this.setRoomTopic(this.getStateFromRequest(state, "m.room.topic").topic),
          this.setRoomAvatarUrl(this.getUrlFromMxc(this.getStateFromRequest(state, "m.room.avatar").url, 'thumbnail'))

      }),
      switchMap(() => this.fetchTimeLine().pipe(
        tap((timeline) => {
          this._timeline$.next(timeline.chunk),
            console.log(timeline),
            this.setEndToken(timeline.end)
        })
      ))
      ).subscribe();
  }

  async fetchMedias(maxImages: number = 50) {
    let timeline: Message[] = [];
    this.setTimeline(timeline);

    if (this.fromStart$) this.setEndToken("t0-0");
    else this.setEndToken("");
    let token = await this.getAccessTokenForGuest(this.homeserver$);
    let direction = this.getDirection();
    let filters = '{"types": ["m.room.message"], "contains_url": true }';
    this.http.get<Timeline>(`https://${this.homeserver$}/_matrix/client/v3/rooms/${this.roomId$}/messages?access_token=${token}${direction}&filter=${filters}&limit=${maxImages}`).pipe(
      tap((timeline) => {
        this.setTimeline(timeline.chunk),
          this.setEndToken(timeline.end),
          console.log(this.timeline$)
      })
    ).subscribe();


  }

  continueOnTimeline() {

    this.fetchTimeLine().pipe(
      tap((timeline) => { this.newTimeline = timeline.chunk, this.setEndToken(timeline.end) }),
      switchMap(() => this.timeline$),
      take(1),
      tap((timeline) => timeline.push(...this.newTimeline)),
      tap((updatedTimeline) => this._timeline$.next(updatedTimeline))
    ).subscribe();
  }

  getRoomState() {
    return this.http.get<any[]>(`https://${this.homeserver$}/_matrix/client/v3/rooms/${this.roomId$}/state?access_token=${this.accessToken$}`);
  }

  getUrlFromMxc(url: string, thumbnail: 'thumbnail' | 'download') {
    let regex = url.match(/^mxc:\/\/([a-zA-Z0-9\.\-]+)\/([0-9a-zA-Z]+)$/i);
    let params = (thumbnail === 'thumbnail' ? '?width=640&height=500&method=scale' : "")
    if (regex?.length) return `https://${this.homeserver$}/_matrix/media/v3/${thumbnail}/${regex[1]}/${regex[2]}${params}`
    else return "";
  }

  getStateFromRequest(stateArray: any[], eventType: string) {
    let matrixEvent = stateArray.find(x => x.type === eventType)
    if (matrixEvent) return matrixEvent.content;
    else return { name: "", url: "", topic: "" } //define an empty object to fill with blank
  }

  private getDirection() {
    return this.fromStart$ ? `&dir=f` : `&dir=b`;
  }

  private setTimeline(timeline: Message[]) {
    this._timeline$.next(timeline);
  }

  private setAccessToken(token: string) {
    this._accessToken$.next(token);
  }

  private setEndToken(token: string) {
    this._endToken$.next(token);
  }

  public setHomeserver(homeserver: string) {
    this._homeserver$.next(homeserver);
  }

  public setRoomId(roomId: string) {
    this._roomId$.next(roomId);
  }

  public setMediaGallery(mediaGallery: boolean) {
    this._mediaGallery$.next(mediaGallery);
    if (mediaGallery) this.setCarousel(false);
  }

  public setCarousel(carousel: boolean) {
    this._carousel$.next(carousel);
    if (carousel) this.setMediaGallery(false);
  }

  public setFromStart(fromStart: boolean) {
    this._fromStart$.next(fromStart);
  }

  private setRoomName(roomName: string) {
    this._roomName$.next(roomName);
  }

  private setRoomTopic(roomTopic: string) {
    this._roomTopic$.next(roomTopic);
  }


  private setRoomAvatarUrl(roomAvatarUrl: string) {
    this._roomAvatarUrl$.next(roomAvatarUrl);
  }



}
