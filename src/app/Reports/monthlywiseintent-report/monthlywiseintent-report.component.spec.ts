import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlywiseintentReportComponent } from './monthlywiseintent-report.component';

describe('MonthlywiseintentReportComponent', () => {
  let component: MonthlywiseintentReportComponent;
  let fixture: ComponentFixture<MonthlywiseintentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlywiseintentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlywiseintentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
