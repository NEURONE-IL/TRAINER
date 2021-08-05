import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoModuleComponent } from './videoModule.component';

describe('VideoModuleComponent', () => {
  let component: VideoModuleComponent;
  let fixture: ComponentFixture<VideoModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoModuleComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
