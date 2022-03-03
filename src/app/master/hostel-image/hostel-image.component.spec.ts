import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelImageComponent } from './hostel-image.component';

describe('HostelImageComponent', () => {
  let component: HostelImageComponent;
  let fixture: ComponentFixture<HostelImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
