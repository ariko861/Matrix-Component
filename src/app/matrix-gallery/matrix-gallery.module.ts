import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrixRoomGalleryComponent } from './matrix-room-gallery/matrix-room-gallery.component';
import { createCustomElement } from '@angular/elements';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    MatrixRoomGalleryComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    MatrixRoomGalleryComponent,
  ]
})
export class MatrixGalleryModule { 
  constructor(private injector: Injector) {
    const el = createCustomElement(MatrixRoomGalleryComponent, { injector });
    customElements.define('matrix-gallery', el);
  }
  ngDoBootstrap() {}
}