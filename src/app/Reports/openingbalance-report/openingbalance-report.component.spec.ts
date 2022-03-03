import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningbalanceReportComponent } from './openingbalance-report.component';

describe('OpeningbalanceReportComponent', () => {
  let component: OpeningbalanceReportComponent;
  let fixture: ComponentFixture<OpeningbalanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpeningbalanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeningbalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
