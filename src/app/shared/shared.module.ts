import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineImageComponent } from './components/timeline-image/timeline-image.component';
import { MarkdownPipe } from './pipes/markdown.pipe';
import { ObserveVisibilityDirective } from './directives/observe-visibility.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { SpaceSummaryComponent } from './components/space-summary/space-summary.component';
import { RoomSummaryComponent } from './components/room-summary/room-summary.component';



@NgModule({
  declarations: [
    TimelineImageComponent,
    MarkdownPipe,
    ObserveVisibilityDirective,
    SpaceSummaryComponent,
    RoomSummaryComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    TimelineImageComponent,
    ObserveVisibilityDirective,
    MarkdownPipe,
    SpaceSummaryComponent,
    RoomSummaryComponent
  ]
})
export class SharedModule { }
