import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowFlowComponent } from './show-flow.component';

describe('ShowFlowComponent', () => {
  let component: ShowFlowComponent;
  let fixture: ComponentFixture<ShowFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowFlowComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
