import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedetailsReportComponent } from './purchasedetails-report.component';

describe('PurchasedetailsReportComponent', () => {
  let component: PurchasedetailsReportComponent;
  let fixture: ComponentFixture<PurchasedetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasedetailsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasedetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
