import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowDisplayComponent } from './flow-display.component';

describe('FlowDisplayComponent', () => {
  let component: FlowDisplayComponent;
  let fixture: ComponentFixture<FlowDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
