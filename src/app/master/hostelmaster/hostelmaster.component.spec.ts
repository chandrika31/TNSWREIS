import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelmasterComponent } from './hostelmaster.component';

describe('HostelmasterComponent', () => {
  let component: HostelmasterComponent;
  let fixture: ComponentFixture<HostelmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
