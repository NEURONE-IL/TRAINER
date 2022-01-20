import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlujosComponent } from './flujos.component';

describe('FlujosComponent', () => {
  let component: FlujosComponent;
  let fixture: ComponentFixture<FlujosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlujosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlujosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
