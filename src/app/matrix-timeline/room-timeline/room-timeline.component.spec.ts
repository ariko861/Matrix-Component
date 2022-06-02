import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomTimelineComponent } from './room-timeline.component';

describe('RoomTimelineComponent', () => {
  let component: RoomTimelineComponent;
  let fixture: ComponentFixture<RoomTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
