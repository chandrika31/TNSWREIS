import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardenDetailsComponent } from './warden-details.component';

describe('WardenDetailsComponent', () => {
  let component: WardenDetailsComponent;
  let fixture: ComponentFixture<WardenDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WardenDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WardenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
