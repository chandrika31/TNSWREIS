import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicemappingReportComponent } from './devicemapping-report.component';

describe('DevicemappingReportComponent', () => {
  let component: DevicemappingReportComponent;
  let fixture: ComponentFixture<DevicemappingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevicemappingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicemappingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
