import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelFundManagementComponent } from './hostel-fund-management.component';

describe('HostelFundManagementComponent', () => {
  let component: HostelFundManagementComponent;
  let fixture: ComponentFixture<HostelFundManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelFundManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelFundManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
