import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineImageComponent } from './components/timeline-image/timeline-image.component';
import { MarkdownPipe } from './pipes/markdown.pipe';
import { ObserveVisibilityDirective } from './directives/observe-visibility.directive';
import { RoomSummaryComponent } from './components/room-summary/room-summary.component';
import { PrintErrorComponent } from './components/print-error/print-error.component';



@NgModule({
  declarations: [
    TimelineImageComponent,
    MarkdownPipe,
    ObserveVisibilityDirective,
    RoomSummaryComponent,
    PrintErrorComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TimelineImageComponent,
    ObserveVisibilityDirective,
    MarkdownPipe,
    RoomSummaryComponent,
    PrintErrorComponent
  ]
})
export class SharedModule { }
