import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrixRoomCarouselComponent } from './matrix-room-carousel/matrix-room-carousel.component';
import { createCustomElement } from '@angular/elements';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    MatrixRoomCarouselComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    MatrixRoomCarouselComponent
  ]
})
export class MatrixCarouselModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(MatrixRoomCarouselComponent, { injector });
    customElements.define('matrix-carousel', el);
  }
  ngDoBootstrap() {}
 }
