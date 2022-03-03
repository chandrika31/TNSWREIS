import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelGalleryComponent } from './hostel-gallery.component';

describe('HostelGalleryComponent', () => {
  let component: HostelGalleryComponent;
  let fixture: ComponentFixture<HostelGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
