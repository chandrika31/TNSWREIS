import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometricDevicemappingComponent } from './biometric-devicemapping.component';

describe('BiometricDevicemappingComponent', () => {
  let component: BiometricDevicemappingComponent;
  let fixture: ComponentFixture<BiometricDevicemappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiometricDevicemappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricDevicemappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
