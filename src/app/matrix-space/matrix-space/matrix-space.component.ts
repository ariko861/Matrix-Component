import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { Message } from 'src/app/shared/models/message.model';
import { Room } from 'src/app/shared/models/room.model';
import { SynapseService } from 'src/app/shared/services/synapse.service';

@Component({
  selector: 'app-matrix-space',
  templateUrl: './matrix-space.component.html',
  styleUrls: ['./matrix-space.component.scss']
})
export class MatrixSpaceComponent implements OnInit {


  timeline$!: Observable<Message[]>;
  fullImageUrl!: string;

  parent_id!: string;

  rooms$!: Observable<Room[]>;

  @Input() homeserver!: string;
  @Input() roomId!: string;
  @Input() fromStart: boolean = false;
  @Input() mediaGallery: boolean = false;

  constructor(private synapse: SynapseService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    if (this.homeserver) this.synapse.setHomeserver(this.homeserver);
    if (this.roomId) this.synapse.setRoomId(this.roomId);
    if (this.fromStart) this.synapse.setFromStart(this.fromStart);
    if (this.mediaGallery) this.synapse.setMediaGallery(this.mediaGallery);

    this.timeline$ = this.synapse.timeline$;

    // this.synapse.getAccessTokenForGuest(this.synapse.homeserver$ )
    this.rooms$ = this.synapse.rooms$;
    this.getParams().pipe(
      switchMap(() => this.synapse.initiateRoom())
    ).subscribe();

  }

  getUrlFromMxc(url: string, thumbnail: 'thumbnail' | 'download') {
    return this.synapse.getUrlFromMxc(url, thumbnail);
  }

  setRoomId(id: string) {
    this.parent_id = this.synapse.roomId$;
    this.synapse.setRoomId(id);
    this.synapse.initiateRoom().subscribe();
  }

  getParent() {
    this.synapse.setRoomId(this.parent_id);
    this.synapse.initiateRoom().subscribe();
    this.parent_id = "";
  }

  getParams() {
    return this.route.queryParams
      .pipe(tap(params => {
        if (params['homeserver'] && params['roomId']) {
          this.synapse.setHomeserver(params['homeserver']);
          this.synapse.setRoomId(params['roomId']);
          this.synapse.setMediaGallery(params['mediaGallery'] == "true");
          this.synapse.setFromStart(params['fromStart'] == "true");
          
        };
      }));
  }

  get isMediaGallery() {
    return this.synapse.mediaGallery$;
  }


}
