import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SynapseService } from '../../services/synapse.service';

@Component({
  selector: 'app-timeline-image',
  templateUrl: './timeline-image.component.html',
  styleUrls: ['./timeline-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class TimelineImageComponent implements OnInit {

  @Input() url!: string;
  @Input() showModal!: boolean;
  

  @Output() destroyUrl = new EventEmitter();

  constructor(private synapse: SynapseService) { }

  ngOnInit(): void {
  }

  getImageFromMxc(url: string | null) {
    if ( url ) return this.synapse.getUrlFromMxc(url, 'download');
    return "";
  }

  hideImage(){
    this.url = "";
    this.destroyUrl.emit();
    this.showModal = false;
  }

}
