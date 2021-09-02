import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoOnlyComponent } from './video-only.component';

describe('VideoModuleComponent', () => {
  let component: VideoOnlyComponent;
  let fixture: ComponentFixture<VideoOnlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoOnlyComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoOnlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
