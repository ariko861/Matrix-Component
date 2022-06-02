import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrixRoomGalleryComponent } from './matrix-room-gallery.component';

describe('MatrixRoomGalleryComponent', () => {
  let component: MatrixRoomGalleryComponent;
  let fixture: ComponentFixture<MatrixRoomGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatrixRoomGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatrixRoomGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
