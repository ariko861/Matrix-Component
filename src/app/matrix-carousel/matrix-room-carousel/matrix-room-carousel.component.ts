import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/shared/models/message.model';
import { SynapseService } from 'src/app/shared/services/synapse.service';

@Component({
  selector: 'app-matrix-room-carousel',
  templateUrl: './matrix-room-carousel.component.html',
  styleUrls: ['./matrix-room-carousel.component.scss']
})
export class MatrixRoomCarouselComponent implements OnInit {

  @Input() homeserver!: string;
  @Input() roomId!: string;
  @Input() fromStart: boolean = false;
  @Input() maxImages: number = 8;
  

  carousel$!: Observable<Message[]>;

  constructor(private synapse: SynapseService) { }

  ngOnInit(): void {

      if ( this.homeserver ) this.synapse.setHomeserver(this.homeserver);
      if ( this.roomId ) this.synapse.setRoomId(this.roomId);
      if ( this.fromStart ) this.synapse.setFromStart(this.fromStart);
      
      this.synapse.fetchMedias(this.maxImages);
      this.carousel$ = this.synapse.timeline$;
  }

  getUrlFromMxc(url: string, thumbnail: 'thumbnail' | 'download') {
    return this.synapse.getUrlFromMxc(url, thumbnail);
  }

}
