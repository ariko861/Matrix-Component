import { Component, Input, OnInit } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Message } from 'src/app/shared/models/message.model';
import { Timeline } from 'src/app/shared/models/timeline.model';
import { SynapseService } from 'src/app/shared/services/synapse.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {

  constructor(private synapse: SynapseService) { }

  @Input()
  parentMessage!: Message;

  threads$!: Observable<Message[]>;

  ngOnInit(): void {
    this.threads$ = this.synapse.getThreadsOfEvent(this.parentMessage).pipe(
      map(timeline => timeline.chunk),
      tap(timeline => console.log(timeline))
    );

  }

}
