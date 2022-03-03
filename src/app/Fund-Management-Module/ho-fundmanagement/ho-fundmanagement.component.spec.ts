import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HOFundmanagementComponent } from './ho-fundmanagement.component';

describe('HOFundmanagementComponent', () => {
  let component: HOFundmanagementComponent;
  let fixture: ComponentFixture<HOFundmanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HOFundmanagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HOFundmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
