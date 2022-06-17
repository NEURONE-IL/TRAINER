import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowSearchDisplayComponent } from './flow-search-display.component';

describe('FlowSearchDisplayComponent', () => {
  let component: FlowSearchDisplayComponent;
  let fixture: ComponentFixture<FlowSearchDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowSearchDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowSearchDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
