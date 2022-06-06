import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { Room } from 'src/app/shared/models/room.model';
import { SynapseService } from 'src/app/shared/services/synapse.service';

@Component({
  selector: 'app-matrix-nav',
  templateUrl: './matrix-nav.component.html',
  styleUrls: ['./matrix-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatrixNavComponent implements OnInit {

  rooms$!: Observable<Room[]>

  constructor(private synapse: SynapseService) { }

  ngOnInit(): void {
    this.rooms$ = this.synapse.rooms$.pipe(
      take(2)
    );
  }

  changeRoom(id: string) {
    this.synapse.setRoomId(id);
    this.synapse.initiateRoom().subscribe();
  }

  getThumbnailFromMxc(url: string) {
    return this.synapse.getUrlFromMxc(url, 'thumbnail');
  }

}
