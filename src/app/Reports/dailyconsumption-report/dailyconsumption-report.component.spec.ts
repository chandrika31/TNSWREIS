import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyconsumptionReportComponent } from './dailyconsumption-report.component';

describe('DailyconsumptionReportComponent', () => {
  let component: DailyconsumptionReportComponent;
  let fixture: ComponentFixture<DailyconsumptionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyconsumptionReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyconsumptionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
