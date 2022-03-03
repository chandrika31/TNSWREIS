import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardenReportComponent } from './warden-report.component';

describe('WardenReportComponent', () => {
  let component: WardenReportComponent;
  let fixture: ComponentFixture<WardenReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WardenReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WardenReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
