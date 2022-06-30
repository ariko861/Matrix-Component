import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintErrorComponent } from './print-error.component';

describe('PrintErrorComponent', () => {
  let component: PrintErrorComponent;
  let fixture: ComponentFixture<PrintErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
