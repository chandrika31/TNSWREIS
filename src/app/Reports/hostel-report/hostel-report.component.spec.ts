import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelReportComponent } from './hostel-report.component';

describe('HostelReportComponent', () => {
  let component: HostelReportComponent;
  let fixture: ComponentFixture<HostelReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
