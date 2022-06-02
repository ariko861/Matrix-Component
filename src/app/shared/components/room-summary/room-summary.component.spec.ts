import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSummaryComponent } from './room-summary.component';

describe('RoomSummaryComponent', () => {
  let component: RoomSummaryComponent;
  let fixture: ComponentFixture<RoomSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
