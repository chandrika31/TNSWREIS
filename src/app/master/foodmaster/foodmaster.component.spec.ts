import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodmasterComponent } from './foodmaster.component';

describe('FoodmasterComponent', () => {
  let component: FoodmasterComponent;
  let fixture: ComponentFixture<FoodmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
