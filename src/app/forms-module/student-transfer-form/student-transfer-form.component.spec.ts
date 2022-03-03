import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTransferFormComponent } from './student-transfer-form.component';

describe('StudentTransferFormComponent', () => {
  let component: StudentTransferFormComponent;
  let fixture: ComponentFixture<StudentTransferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentTransferFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentTransferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
