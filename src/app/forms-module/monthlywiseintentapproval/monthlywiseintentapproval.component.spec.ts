import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlywiseintentapprovalComponent } from './monthlywiseintentapproval.component';

describe('MonthlywiseintentapprovalComponent', () => {
  let component: MonthlywiseintentapprovalComponent;
  let fixture: ComponentFixture<MonthlywiseintentapprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlywiseintentapprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlywiseintentapprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
