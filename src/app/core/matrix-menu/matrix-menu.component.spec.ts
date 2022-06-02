import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixMenuComponent } from './matrix-menu.component';

describe('MatrixMenuComponent', () => {
  let component: MatrixMenuComponent;
  let fixture: ComponentFixture<MatrixMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrixMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
