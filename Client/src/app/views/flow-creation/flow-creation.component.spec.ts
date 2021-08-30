import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowCreationComponent } from './flow-creation.component';

describe('FlowCreationComponent', () => {
  let component: FlowCreationComponent;
  let fixture: ComponentFixture<FlowCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
