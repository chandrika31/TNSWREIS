import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DOFundManagementComponent } from './do-fund-management.component';

describe('DOFundManagementComponent', () => {
  let component: DOFundManagementComponent;
  let fixture: ComponentFixture<DOFundManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DOFundManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DOFundManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
