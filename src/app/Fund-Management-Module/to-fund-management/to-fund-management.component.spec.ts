import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TOFundManagementComponent } from './to-fund-management.component';

describe('TOFundManagementComponent', () => {
  let component: TOFundManagementComponent;
  let fixture: ComponentFixture<TOFundManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TOFundManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TOFundManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
