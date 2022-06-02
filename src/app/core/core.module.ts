import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrixMenuComponent } from './matrix-menu/matrix-menu.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MatrixMenuComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    MatrixMenuComponent
  ]
})
export class CoreModule { }
