import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageImageUploadComponent } from './homepage-image-upload.component';

describe('HomepageImageUploadComponent', () => {
  let component: HomepageImageUploadComponent;
  let fixture: ComponentFixture<HomepageImageUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageImageUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
