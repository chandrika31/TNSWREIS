import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingchargestypeComponent } from './feedingchargestype.component';

describe('FeedingchargestypeComponent', () => {
  let component: FeedingchargestypeComponent;
  let fixture: ComponentFixture<FeedingchargestypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedingchargestypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedingchargestypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
