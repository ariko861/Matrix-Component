import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Config } from './shared/models/config.model';
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
    if ( environment.homeserver && environment.roomId ) {
      let config = new Config;
      config.homeserver = environment.homeserver;
      config.roomId = environment.roomId;
      this.synapse.setPageConfig(config);

    }

  }

  
  get isGallery(): boolean {
    return this.synapse.pageConfig$.mediaGallery;
  }

  get isCarousel(): boolean {
    return this.synapse.pageConfig$.carousel;
  }

}
