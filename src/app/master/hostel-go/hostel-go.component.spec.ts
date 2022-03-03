import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelGoComponent } from './hostel-go.component';

describe('HostelGoComponent', () => {
  let component: HostelGoComponent;
  let fixture: ComponentFixture<HostelGoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelGoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
