import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodEntitlementComponent } from './food-entitlement.component';

describe('FoodEntitlementComponent', () => {
  let component: FoodEntitlementComponent;
  let fixture: ComponentFixture<FoodEntitlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodEntitlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodEntitlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
