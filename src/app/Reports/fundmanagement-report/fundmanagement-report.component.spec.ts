import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundmanagementReportComponent } from './fundmanagement-report.component';

describe('FundmanagementReportComponent', () => {
  let component: FundmanagementReportComponent;
  let fixture: ComponentFixture<FundmanagementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundmanagementReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundmanagementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
