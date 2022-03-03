import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeattendanceReportComponent } from './employeeattendance-report.component';

describe('EmployeeattendanceReportComponent', () => {
  let component: EmployeeattendanceReportComponent;
  let fixture: ComponentFixture<EmployeeattendanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeattendanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeattendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
