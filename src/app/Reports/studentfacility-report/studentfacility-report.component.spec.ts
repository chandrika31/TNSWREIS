import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentfacilityReportComponent } from './studentfacility-report.component';

describe('StudentfacilityReportComponent', () => {
  let component: StudentfacilityReportComponent;
  let fixture: ComponentFixture<StudentfacilityReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentfacilityReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentfacilityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
