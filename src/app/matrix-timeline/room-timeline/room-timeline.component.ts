import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Config } from 'src/app/shared/models/config.model';
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

    if (this.homeserver && this.roomId) {
      let config = new Config;
      config.homeserver = this.homeserver;
      config.roomId = this.roomId;
      config.fromStart = this.fromStart;
      this.synapse.setPageConfig(config);
    }
    this.synapse.firstTimelineSync();

    

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
