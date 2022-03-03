import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseorderReportComponent } from './purchaseorder-report.component';

describe('PurchaseorderReportComponent', () => {
  let component: PurchaseorderReportComponent;
  let fixture: ComponentFixture<PurchaseorderReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseorderReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseorderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
