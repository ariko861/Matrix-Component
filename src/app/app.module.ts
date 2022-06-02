import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatrixCarouselModule } from './matrix-carousel/matrix-carousel.module';
import { MatrixGalleryModule } from './matrix-gallery/matrix-gallery.module';
import { MatrixTimelineModule } from './matrix-timeline/matrix-timeline.module';
import { CoreModule } from './core/core.module';
import { MatrixSpaceModule } from './matrix-space/matrix-space.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatrixTimelineModule,
    CoreModule,
    MatrixCarouselModule,
    MatrixSpaceModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
