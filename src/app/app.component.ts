import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SynapseService } from './shared/services/synapse.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'matrix-component';

  environment = environment;
  constructor(private synapse: SynapseService, private route: ActivatedRoute) {}


  ngOnInit(): void {
    if ( environment.homeserver ) this.synapse.setHomeserver(environment.homeserver);
    if (environment.roomId ) this.synapse.setRoomId(environment.roomId);


  }

  
  get isGallery(): boolean {
    return this.synapse.mediaGallery$;
  }

  get isCarousel(): boolean {
    return this.synapse.carousel$;
  }

}
