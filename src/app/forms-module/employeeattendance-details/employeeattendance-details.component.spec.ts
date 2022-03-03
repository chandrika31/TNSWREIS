import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeattendanceDetailsComponent } from './employeeattendance-details.component';

describe('EmployeeattendanceDetailsComponent', () => {
  let component: EmployeeattendanceDetailsComponent;
  let fixture: ComponentFixture<EmployeeattendanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeattendanceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeattendanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
