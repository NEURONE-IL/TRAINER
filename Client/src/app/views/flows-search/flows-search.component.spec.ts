import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowsSearchComponent } from './flows-search.component';

describe('FlowsSearchComponent', () => {
  let component: FlowsSearchComponent;
  let fixture: ComponentFixture<FlowsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowsSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
