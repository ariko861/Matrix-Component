import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'src/app/shared/models/message.model';
import { SynapseService } from 'src/app/shared/services/synapse.service';

@Component({
  selector: 'app-timeline-event',
  templateUrl: './timeline-event.component.html',
  styleUrls: ['./timeline-event.component.scss']
})
export class TimelineEventComponent implements OnInit {

  constructor(private synapse: SynapseService) { }

  @Input()
  message!: Message;

  @Output()
  clickOnImage = new EventEmitter();

  ngOnInit(): void {
  }

  getUrlFromMxc(url: string, thumbnail: 'thumbnail' | 'download') {
    return this.synapse.getUrlFromMxc(url, thumbnail);
  }

  imageClick(message: Message){
    this.clickOnImage.emit(message);

  }

}
