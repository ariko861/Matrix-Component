import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-error',
  templateUrl: './print-error.component.html',
  styleUrls: ['./print-error.component.scss']
})
export class PrintErrorComponent implements OnInit {

  constructor() { }

  @Input("control")
  control: any;

  @Input()
  errorMessage!: string;

  ngOnInit(): void {
  }

}
