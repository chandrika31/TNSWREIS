import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiometricattendancecountComponent } from './biometricattendancecount.component';

describe('BiometricattendancecountComponent', () => {
  let component: BiometricattendancecountComponent;
  let fixture: ComponentFixture<BiometricattendancecountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiometricattendancecountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiometricattendancecountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
