import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometricAttendanceComponent } from './biometric-attendance.component';

describe('BiometricAttendanceComponent', () => {
  let component: BiometricAttendanceComponent;
  let fixture: ComponentFixture<BiometricAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiometricAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
