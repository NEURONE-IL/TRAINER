import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStagesComponent } from './show-stages.component';

describe('ShowStagesComponent', () => {
  let component: ShowStagesComponent;
  let fixture: ComponentFixture<ShowStagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowStagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
