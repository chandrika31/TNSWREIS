import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFeedbackRegistrationComponent } from './student-feedback-registration.component';

describe('StudentFeedbackRegistrationComponent', () => {
  let component: StudentFeedbackRegistrationComponent;
  let fixture: ComponentFixture<StudentFeedbackRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentFeedbackRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFeedbackRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
