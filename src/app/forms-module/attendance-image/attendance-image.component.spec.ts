import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceImageComponent } from './attendance-image.component';

describe('AttendanceImageComponent', () => {
  let component: AttendanceImageComponent;
  let fixture: ComponentFixture<AttendanceImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
