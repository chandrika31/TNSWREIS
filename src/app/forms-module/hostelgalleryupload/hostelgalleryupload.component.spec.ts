import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelgalleryuploadComponent } from './hostelgalleryupload.component';

describe('HostelgalleryComponent', () => {
  let component: HostelgalleryuploadComponent;
  let fixture: ComponentFixture<HostelgalleryuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelgalleryuploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelgalleryuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
