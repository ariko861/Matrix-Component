import { Component, OnInit } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { Room } from 'src/app/shared/models/room.model';
import { SynapseService } from 'src/app/shared/services/synapse.service';

@Component({
  selector: 'app-matrix-nav',
  templateUrl: './matrix-nav.component.html',
  styleUrls: ['./matrix-nav.component.scss']
})
export class MatrixNavComponent implements OnInit {

  rooms!: Room[];

  constructor(private synapse: SynapseService) { }

  ngOnInit(): void {
    this.synapse.rooms$.pipe(
      take(2),
      tap((rooms) => this.rooms = rooms)
    ).subscribe();
  }

  changeRoom(id: string) {
    if (!this.synapse.parentId$) this.synapse.setParentId(this.synapse.roomId$);
    this.synapse.setRoomId(id);
    this.synapse.initiateRoom().subscribe();
  }

}
