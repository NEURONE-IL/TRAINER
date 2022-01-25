import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowUpdateComponent } from './flow-update.component';

describe('FlowUpdateComponent', () => {
  let component: FlowUpdateComponent;
  let fixture: ComponentFixture<FlowUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
