import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixRoomCarouselComponent } from './matrix-room-carousel.component';

describe('MatrixRoomCarouselComponent', () => {
  let component: MatrixRoomCarouselComponent;
  let fixture: ComponentFixture<MatrixRoomCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrixRoomCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixRoomCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
