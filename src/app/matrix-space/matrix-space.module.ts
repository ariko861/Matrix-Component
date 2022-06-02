import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatrixTimelineModule } from '../matrix-timeline/matrix-timeline.module';
import { MatrixGalleryModule } from '../matrix-gallery/matrix-gallery.module';
import { MatrixSpaceComponent } from './matrix-space/matrix-space.component';
import { createCustomElement } from '@angular/elements';



@NgModule({
  declarations: [ MatrixSpaceComponent ],
  imports: [
    CommonModule,
    SharedModule,
    MatrixTimelineModule,
    MatrixGalleryModule
  ], 
  exports: [
    MatrixSpaceComponent
  ]
})
export class MatrixSpaceModule {
  constructor(private injector: Injector) {
    const el = createCustomElement(MatrixSpaceComponent, { injector });
    customElements.define('matrix-space', el);
  }
  ngDoBootstrap() {}
 }
