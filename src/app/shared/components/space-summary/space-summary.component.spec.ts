import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceSummaryComponent } from './space-summary.component';

describe('SpaceSummaryComponent', () => {
  let component: SpaceSummaryComponent;
  let fixture: ComponentFixture<SpaceSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
