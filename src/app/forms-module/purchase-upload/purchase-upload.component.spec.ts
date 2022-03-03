import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseUploadComponent } from './purchase-upload.component';

describe('PurchaseUploadComponent', () => {
  let component: PurchaseUploadComponent;
  let fixture: ComponentFixture<PurchaseUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
