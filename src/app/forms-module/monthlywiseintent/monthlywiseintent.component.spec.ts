import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlywiseintentComponent } from './monthlywiseintent.component';

describe('MonthlywiseintentComponent', () => {
  let component: MonthlywiseintentComponent;
  let fixture: ComponentFixture<MonthlywiseintentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlywiseintentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlywiseintentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
