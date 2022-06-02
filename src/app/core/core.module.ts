import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatrixMenuComponent } from './matrix-menu/matrix-menu.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatrixNavComponent } from './matrix-nav/matrix-nav.component';



@NgModule({
  declarations: [
    MatrixMenuComponent,
    MatrixNavComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    MatrixMenuComponent,
    MatrixNavComponent
  ]
})
export class CoreModule { }
