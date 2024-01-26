import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowsCardDisplayComponent } from './flows-card-display.component';

describe('FlowsCardDisplayComponent', () => {
  let component: FlowsCardDisplayComponent;
  let fixture: ComponentFixture<FlowsCardDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FlowsCardDisplayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowsCardDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
