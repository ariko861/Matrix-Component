import { Component, Input, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
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

  constructor(private synapse: SynapseService) { }

  ngOnInit(): void {
    this.timeline$ = this.synapse.timeline$;

    if (this.homeserver) this.synapse.setHomeserver(this.homeserver);
    if (this.roomId) this.synapse.setRoomId(this.roomId);
    if (this.fromStart) this.synapse.setFromStart(this.fromStart);
    if (this.mediaGallery) this.synapse.setMediaGallery(this.mediaGallery);
    
    
    // this.synapse.getAccessTokenForGuest(this.synapse.homeserver$ )
    this.rooms$ = this.synapse.rooms$;
    this.synapse.initiateRoom().subscribe();
    
  }

  getUrlFromMxc(url: string, thumbnail: 'thumbnail' | 'download') {
    return this.synapse.getUrlFromMxc(url, thumbnail);
  }

  setRoomId(id: string){
    this.parent_id = this.synapse.roomId$;
    this.synapse.setRoomId(id);
    this.synapse.initiateRoom().subscribe();
  }

  getParent(){
    this.synapse.setRoomId(this.parent_id);
    this.synapse.initiateRoom().subscribe();
    this.parent_id = "";
  }

  get isMediaGallery() {
    return this.synapse.mediaGallery$;
  }

}
