import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiConfigurationComponent } from './apiConfiguration.component';

describe('ApiConfigurationComponent', () => {
  let component: ApiConfigurationComponent;
  let fixture: ComponentFixture<ApiConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
