import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowsDisplayComponent } from './flows-display.component';

describe('FlowsDisplayComponent', () => {
  let component: FlowsDisplayComponent;
  let fixture: ComponentFixture<FlowsDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
