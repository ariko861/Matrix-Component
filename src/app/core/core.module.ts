import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrixMenuComponent } from './matrix-menu/matrix-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatrixNavComponent } from './matrix-nav/matrix-nav.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    MatrixMenuComponent,
    MatrixNavComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    MatrixMenuComponent,
    MatrixNavComponent
  ]
})
export class CoreModule { }
