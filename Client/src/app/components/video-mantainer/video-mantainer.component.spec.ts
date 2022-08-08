import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoMantainerComponent } from './video-mantainer.component';

describe('VideoMantainerComponent', () => {
  let component: VideoMantainerComponent;
  let fixture: ComponentFixture<VideoMantainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoMantainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoMantainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
