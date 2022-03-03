import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometricattendanceComponent } from './biometricattendance.component';

describe('BiometricattendanceComponent', () => {
  let component: BiometricattendanceComponent;
  let fixture: ComponentFixture<BiometricattendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiometricattendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
