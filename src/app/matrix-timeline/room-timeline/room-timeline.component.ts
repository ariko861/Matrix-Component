import { Component, Input, OnInit } from '@angular/core';
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


}
