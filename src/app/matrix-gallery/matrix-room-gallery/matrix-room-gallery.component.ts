import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from 'src/app/shared/models/config.model';
import { Message } from 'src/app/shared/models/message.model';
import { SynapseService } from 'src/app/shared/services/synapse.service';

@Component({
  selector: 'app-matrix-room-gallery',
  templateUrl: './matrix-room-gallery.component.html',
  styleUrls: ['./matrix-room-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatrixRoomGalleryComponent implements OnInit {

  @Input() homeserver!: string;
  @Input() roomId!: string;
  @Input() fromStart: boolean = false;

  fullImageUrl!: string;
  showImageOnScreen: boolean = false;
  timeline$!: Observable<Message[]>;

  constructor(private synapse: SynapseService) { }

  ngOnInit(): void {

    if (this.homeserver && this.roomId) {
      let config = new Config;
      config.homeserver = this.homeserver;
      config.roomId = this.roomId;
      config.fromStart = this.fromStart;
      config.mediaGallery = true;
      this.synapse.setPageConfig(config);
    }

    this.timeline$ = this.synapse.timeline$;
    this.synapse.fetchMedias();
  }

  getUrlFromMxc(url: string, thumbnail: 'thumbnail' | 'download') {
    return this.synapse.getUrlFromMxc(url, thumbnail);
  }

  timelineScrolled() {
    this.synapse.continueOnTimeline('image').subscribe();
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
