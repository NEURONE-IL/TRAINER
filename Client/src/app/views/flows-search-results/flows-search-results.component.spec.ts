import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowsSearchResultsComponent } from './flows-search-results.component';

describe('FlowsSearchResultsComponent', () => {
  let component: FlowsSearchResultsComponent;
  let fixture: ComponentFixture<FlowsSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowsSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowsSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
