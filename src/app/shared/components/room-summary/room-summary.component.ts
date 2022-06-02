import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-summary',
  templateUrl: './room-summary.component.html',
  styleUrls: ['./room-summary.component.scss']
})
export class RoomSummaryComponent implements OnInit {

  @Input() name!: string;
  @Input() topic!: string;
  @Input() avatar_url!: string;
  @Input() room_id!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
