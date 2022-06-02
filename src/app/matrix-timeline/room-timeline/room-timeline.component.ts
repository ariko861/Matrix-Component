import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SynapseService } from 'src/app/shared/services/synapse.service';
import { Message } from '../../shared/models/message.model';

@Component({
  selector: 'app-room-timeline',
  templateUrl: './room-timeline.component.html',
  styleUrls: ['./room-timeline.component.scss']
})
export class RoomTimelineComponent implements OnInit {

  timeline$!: Observable<Message[]>;
  fullImageUrl!: string;
  showImageOnScreen: boolean = false;
  
  @Input() homeserver!: string;
  @Input() roomId!: string;
  @Input() fromStart: boolean = false;
  
  constructor(private synapse: SynapseService) { }


  ngOnInit(): void {
    this.timeline$ = this.synapse.timeline$;

    if (this.homeserver) this.synapse.setHomeserver(this.homeserver);
    if (this.roomId) this.synapse.setRoomId(this.roomId);
    if (this.fromStart) this.synapse.setFromStart(this.fromStart);
    this.synapse.firstTimelineSync();

    

  }

  getUrlFromMxc(url: string, thumbnail: 'thumbnail' | 'download') {
    return this.synapse.getUrlFromMxc(url, thumbnail);
  }

  timelineScrolled() {
    this.synapse.continueOnTimeline('text').subscribe();

  }

  imageClick(message: Message){
    this.fullImageUrl = message.content.url;
    if (!this.showImageOnScreen) this.showImageOnScreen = true;
  }

  hideModal() {
    this.fullImageUrl = '';
    this.showImageOnScreen = false;
  }


}
