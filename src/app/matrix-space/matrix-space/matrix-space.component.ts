import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { Config } from 'src/app/shared/models/config.model';
import { Message } from 'src/app/shared/models/message.model';
import { Room } from 'src/app/shared/models/room.model';
import { SynapseService } from 'src/app/shared/services/synapse.service';

@Component({
  selector: 'app-matrix-space',
  templateUrl: './matrix-space.component.html',
  styleUrls: ['./matrix-space.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatrixSpaceComponent implements OnInit {


  timeline$!: Observable<Message[]>;
  fullImageUrl!: string;
  favicon: HTMLLinkElement | null = document.querySelector('#appIcon');

  rooms$!: Observable<Room[]>;

  @Input() homeserver!: string;
  @Input() roomId!: string;
  @Input() fromStart: boolean = false;
  @Input() mediaGallery: boolean = false;

  constructor(private synapse: SynapseService, private route: ActivatedRoute, private title: Title) { }

  ngOnInit(): void {

    if (this.homeserver) this.synapse.setHomeserver(this.homeserver);
    if (this.roomId) this.synapse.setRoomId(this.roomId);
    if (this.fromStart) this.synapse.setFromStart(this.fromStart);
    if (this.mediaGallery) this.synapse.setMediaGallery(this.mediaGallery);

    this.timeline$ = this.synapse.timeline$;

    // this.synapse.getAccessTokenForGuest(this.synapse.homeserver$ )
    this.rooms$ = this.synapse.rooms$;
    this.getParams().pipe(
      switchMap(() => this.synapse.initiateRoom()),
      tap( result => { 
        this.title.setTitle(result.rooms[0].name),
        this.changeIcon(result.rooms[0].avatar_url)
      })
    ).subscribe();

  }

  getUrlFromMxc(url: string, thumbnail: 'thumbnail' | 'download') {
    return this.synapse.getUrlFromMxc(url, thumbnail);
  }

  setRoomId(id: string) {
    this.synapse.setParentId(this.synapse.roomId$);
    this.synapse.setRoomId(id);
    this.synapse.initiateRoom().subscribe();
  }

  getParent() {
    this.synapse.setRoomId(this.synapse.parentId$);
    this.synapse.initiateRoom().subscribe();
    this.synapse.setParentId("");
  }

  get hasParent(){
    return this.synapse.parentId$;
  }

  getParams() {
    return this.route.queryParams
      .pipe(tap(params => {
        if (params['homeserver'] && params['roomId']) {
          let config = new Config;
          config.homeserver = params['homeserver'];
          config.roomId = params['roomId'];
          config.parentId = params['roomId'];
          if (params['mediaGallery']) config.mediaGallery = (params['mediaGallery'] == "true");
          if (params['fromStart']) config.fromStart = (params['fromStart'] == "true");
          if (params['sendersFiltered']) config.senderFilter = (params['sendersFiltered'].split(","));
          this.synapse.setPageConfig(config);

        };
      }));
  }

  changeIcon(url: string): void {
    if (this.favicon && url ) this.favicon.href = this.getUrlFromMxc(url, 'thumbnail');  
  }

  get isMediaGallery() {
    return this.synapse.mediaGallery$;
  }

  get urlParams() {
    return this.synapse.urlParams;
  }

}
