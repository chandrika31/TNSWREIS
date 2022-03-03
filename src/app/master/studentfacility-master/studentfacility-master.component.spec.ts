import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentfacilityMasterComponent } from './studentfacility-master.component';

describe('StudentfacilityMasterComponent', () => {
  let component: StudentfacilityMasterComponent;
  let fixture: ComponentFixture<StudentfacilityMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentfacilityMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentfacilityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
