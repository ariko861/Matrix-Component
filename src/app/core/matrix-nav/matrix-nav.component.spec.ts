import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixNavComponent } from './matrix-nav.component';

describe('MatrixNavComponent', () => {
  let component: MatrixNavComponent;
  let fixture: ComponentFixture<MatrixNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrixNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
