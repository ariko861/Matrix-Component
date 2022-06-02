import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, concat, EMPTY, firstValueFrom, iif, lastValueFrom, map, merge, mergeMap, Observable, switchMap, take, tap } from 'rxjs';
import { combineLatestInit } from 'rxjs/internal/observable/combineLatest';
import { Message } from '../models/message.model';
import { Room } from '../models/room.model';
import { Timeline } from '../models/timeline.model';

@Injectable({
  providedIn: 'root'
})
export class SynapseService {

  constructor(private http: HttpClient) { }

  // access_token!: string;
  newTimeline!: Message[];

  access_token!: string;

  private _rooms$ = new BehaviorSubject<Room[]>([]);
  get rooms$(): Observable<Room[]> {
    return this._rooms$.asObservable();
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



  getAccessTokenForGuest() {
    return this.http.post<{ access_token: string }>(`https://${this.homeserver$}/_matrix/client/v3/register?kind=guest`, { initial_device_display_name: "matrix-component" }).pipe(
      tap((response) => this.setAccessToken(response.access_token))
    );
  }

  initiateRoom() {
    if (this.accessToken$) return this.getRoomHierarchy();
    else {
      return this.getAccessTokenForGuest().pipe(
        switchMap(() => { return this.getRoomHierarchy() })
      );
    }
  }

  // getStartPoint() {
  //   if (!this.fromStart$) return EMPTY;
  //   else {
  //     let filter =  `{"types":["m.room.history_visibility"]}`;
  //     return this.getRoomState("m.room.history_visibility");
  //   }
  // }

  initEndToken() {
    if (this.fromStart$) this.setEndToken("t0-0")
    else this.setEndToken("");
  }

  getRoomHierarchy() {
    return this.http.get<{ rooms: Room[] }>(`https://${this.homeserver$}/_matrix/client/v1/rooms/${this.roomId$}/hierarchy?access_token=${this.accessToken$}&suggested_only=true`).pipe(
      tap(response => this.setRooms(response.rooms))
    );
  }

  fetchTimeLine(filters = `{"types":["m.room.message"]}`) {
    let from = (this.endToken$ ? `&from=${this.endToken$}` : '');
    return this.http.get<Timeline>(`https://${this.homeserver$}/_matrix/client/v3/rooms/${this.roomId$}/messages?access_token=${this.accessToken$}${this.getDirection()}${from}&filter=${filters}`);
  }

  firstTimelineSync() {

    this.initEndToken(); // reinitialize end Token
    this.fetchTimeLine().pipe(
      tap((timeline) => {
        this._timeline$.next(timeline.chunk),
          this.setEndToken(timeline.end)
      }),
      switchMap(timeline => iif(() => timeline.chunk.length === 0, this.continueOnTimeline('text'), EMPTY))
    ).subscribe();
  }

  fetchMedias(maxImages: number = 50) {
    // let timeline: Message[] = [];
    // this.setTimeline(timeline);

    this.initEndToken();

    let filters = '{"types": ["m.room.message"], "contains_url": true }';
    this.fetchTimeLine(filters).pipe(
      tap((timeline) => {
        this.setTimeline(timeline.chunk),
          this.setEndToken(timeline.end)
      }),
      switchMap(timeline => iif(() => timeline.chunk.length === 0, this.continueOnTimeline('image'), EMPTY))
    ).subscribe();


  }

  continueOnTimeline(type: 'image' | 'text'): any {
    let filter = ( type === 'image' ? '{"types": ["m.room.message"], "contains_url": true }' : `{"types":["m.room.message"]}` )

    return this.fetchTimeLine(filter).pipe(
      tap((timeline) => { this.newTimeline = timeline.chunk, this.setEndToken(timeline.end) }),
      switchMap(timeline => iif(() => timeline.chunk.length === 0, this.continueOnTimeline(type), this.timeline$.pipe( // keep fetching if no result
        take(1),
        tap((timeline) => timeline.push(...this.newTimeline)),
        tap((updatedTimeline) => this._timeline$.next(updatedTimeline))
      ))),

    );
  }

  getRoomState(filter: string = "") {
    let roomStates = this.http.get<any[]>(`https://${this.homeserver$}/_matrix/client/v3/rooms/${this.roomId$}/state?access_token=${this.accessToken$}`);
    if (!filter) return roomStates;
    else return roomStates.pipe(
      map(result => result.find(x => x.type === filter)),
      tap(result => console.log(result))
    )
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

  private setRooms(rooms: Room[]) {
    this._rooms$.next(rooms);
  }



}
