import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedingchargestypeReportComponent } from './feedingchargestype-report.component';

describe('FeedingchargestypeReportComponent', () => {
  let component: FeedingchargestypeReportComponent;
  let fixture: ComponentFixture<FeedingchargestypeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedingchargestypeReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedingchargestypeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
