import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, iif, map, Observable, switchMap, take, tap } from 'rxjs';
import { Config } from '../models/config.model';
import { Filter } from '../models/filter.model';
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

  private _pageConfig$ = new BehaviorSubject<Config>(new Config);
  get pageConfig$(): Config {
    return this._pageConfig$.getValue();
  }


  getAccessTokenForGuest() {
    return this.http.post<{ access_token: string }>(`https://${this.pageConfig$.homeserver}/_matrix/client/v3/register?kind=guest`, { initial_device_display_name: "matrix-component" }).pipe(
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

  initEndToken() {
    if (this.pageConfig$.fromStart) this.setEndToken("t0-0")
    else this.setEndToken("");
  }

  getRoomHierarchy() {
    return this.http.get<{ rooms: Room[] }>(`https://${this.pageConfig$.homeserver}/_matrix/client/v1/rooms/${this.pageConfig$.roomId}/hierarchy?access_token=${this.accessToken$}&suggested_only=true`).pipe(
      tap(response => this.setRooms(response.rooms))
    );
  }

  fetchTimeLine(typeFilter: string[] = ["m.room.message"], contains_url: null | boolean = null) {

    let from = (this.endToken$ ? `&from=${this.endToken$}` : '');
    let limit = 30;
    let thisFilter = new Filter;
    thisFilter.types = typeFilter;
    if (contains_url !== null) thisFilter.contains_url = contains_url;
    if (this.pageConfig$.senderFilter && this.pageConfig$.senderFilter.length > 0) thisFilter.not_senders = this.pageConfig$.senderFilter;

    return this.http.get<Timeline>(`https://${this.pageConfig$.homeserver}/_matrix/client/v3/rooms/${this.pageConfig$.roomId}/messages?access_token=${this.accessToken$}${this.getDirection()}${from}&filter=${thisFilter.print()}&limit=${limit}`).pipe(
      // tap((timeline) => {
      //   this._timeline$.next(timeline.chunk),
      //     this.setEndToken(timeline.end)
      // }),
    );
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

    this.initEndToken();

    let typesFilter = ["m.room.message"];
    this.fetchTimeLine(typesFilter, true).pipe(
      tap((timeline) => {
        this.setTimeline(timeline.chunk),
          this.setEndToken(timeline.end)
      }),
      switchMap(timeline => iif(() => timeline.chunk.length === 0, this.continueOnTimeline('image'), EMPTY))
    ).subscribe();


  }

  continueOnTimeline(type: 'image' | 'text', loop = 20): any { // the loop value is to avoid a loop of multiple calls
    let typesFilter = ["m.room.message"];
    let contains_url = (type === 'image' ? true : null)
    loop--;
    return this.fetchTimeLine(typesFilter, contains_url).pipe(
      tap((timeline) => { 
        this.newTimeline = timeline.chunk;
        if (timeline.end ) this.setEndToken(timeline.end) 
      }),
      switchMap(timeline => iif(() => timeline.chunk.length === 0 && loop > 0, this.continueOnTimeline(type, loop), this.timeline$.pipe( // keep fetching if no result
        take(1),
        tap((timeline) => timeline.push(...this.newTimeline)),
        tap((updatedTimeline) => this._timeline$.next(updatedTimeline))
      ))),

    );
  }

  getRoomState(filter: string = "") {
    let roomStates = this.http.get<any[]>(`https://${this.pageConfig$.homeserver}/_matrix/client/v3/rooms/${this.pageConfig$.roomId}/state?access_token=${this.accessToken$}`);
    if (!filter) return roomStates;
    else return roomStates.pipe(
      map(result => result.find(x => x.type === filter)),
      tap(result => console.log(result))
    )
  }

  getUrlFromMxc(url: string, thumbnail: 'thumbnail' | 'download') {
    let regex = url.match(/^mxc:\/\/([a-zA-Z0-9\.\-]+)\/([0-9a-zA-Z]+)$/i);
    let params = (thumbnail === 'thumbnail' ? '?width=640&height=500&method=scale' : "")
    if (regex?.length) return `https://${this.pageConfig$.homeserver}/_matrix/media/v3/${thumbnail}/${regex[1]}/${regex[2]}${params}`
    else return "";
  }

  getStateFromRequest(stateArray: any[], eventType: string) {
    let matrixEvent = stateArray.find(x => x.type === eventType)
    if (matrixEvent) return matrixEvent.content;
    else return { name: "", url: "", topic: "" } //define an empty object to fill with blank
  }

  private getDirection() {
    return this.pageConfig$.fromStart ? `&dir=f` : `&dir=b`;
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

  public setRoomId(roomId: string) {
    let newPage = this.pageConfig$;
    newPage.roomId = roomId;
    this._pageConfig$.next(newPage);
  }

  public setPageConfig(config: Config) {
    this._pageConfig$.next(config);
  }

  private setRooms(rooms: Room[]) {
    this._rooms$.next(rooms);
  }



}
