import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/shared/models/message.model';
import { SynapseService } from 'src/app/shared/services/synapse.service';

@Component({
  selector: 'app-matrix-room-gallery',
  templateUrl: './matrix-room-gallery.component.html',
  styleUrls: ['./matrix-room-gallery.component.scss']
})
export class MatrixRoomGalleryComponent implements OnInit {

  @Input() homeserver!: string;
  @Input() roomId!: string;
  @Input() fromStart: boolean = false;

  fullImageUrl!: string;
  timeline$!: Observable<Message[]>;

  constructor(private synapse: SynapseService) { }

  ngOnInit(): void {
    this.timeline$ = this.synapse.timeline$;
    this.synapse.fetchMedias();
  }

  getUrlFromMxc(url: string, thumbnail: 'thumbnail' | 'download') {
    return this.synapse.getUrlFromMxc(url, thumbnail);
  }

  timelineScrolled() {
    this.synapse.continueOnTimeline('image').subscribe();
  }

}
