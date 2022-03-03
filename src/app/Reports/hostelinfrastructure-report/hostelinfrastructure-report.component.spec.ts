import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelinfrastructureReportComponent } from './hostelinfrastructure-report.component';

describe('HostelinfrastructureReportComponent', () => {
  let component: HostelinfrastructureReportComponent;
  let fixture: ComponentFixture<HostelinfrastructureReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelinfrastructureReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelinfrastructureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
