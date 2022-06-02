import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomTimelineComponent } from './room-timeline/room-timeline.component';
import { SharedModule } from '../shared/shared.module';
import { createCustomElement } from '@angular/elements';



@NgModule({
  declarations: [
    RoomTimelineComponent,
  ],
  imports: [
    CommonModule,
    SharedModule, 
  ], 
  exports: [
    RoomTimelineComponent,
  ]
})
export class MatrixTimelineModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(RoomTimelineComponent, { injector });
    customElements.define('matrix-timeline', el);
  }
  ngDoBootstrap() {}
 }
