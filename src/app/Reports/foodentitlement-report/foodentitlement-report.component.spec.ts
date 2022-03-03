import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodentitlementReportComponent } from './foodentitlement-report.component';

describe('FoodentitlementReportComponent', () => {
  let component: FoodentitlementReportComponent;
  let fixture: ComponentFixture<FoodentitlementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodentitlementReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodentitlementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
