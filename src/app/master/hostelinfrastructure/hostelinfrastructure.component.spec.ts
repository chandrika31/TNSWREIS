import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelinfrastructureComponent } from './hostelinfrastructure.component';

describe('HostelinfrastructureComponent', () => {
  let component: HostelinfrastructureComponent;
  let fixture: ComponentFixture<HostelinfrastructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelinfrastructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelinfrastructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
