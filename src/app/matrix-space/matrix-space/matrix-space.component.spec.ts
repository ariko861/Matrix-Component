import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixSpaceComponent } from './matrix-space.component';

describe('MatrixSpaceComponent', () => {
  let component: MatrixSpaceComponent;
  let fixture: ComponentFixture<MatrixSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrixSpaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
