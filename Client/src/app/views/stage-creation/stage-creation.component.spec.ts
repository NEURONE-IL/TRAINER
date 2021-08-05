import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageCreationComponent } from './stage-creation.component';

describe('StageCreationComponent', () => {
  let component: StageCreationComponent;
  let fixture: ComponentFixture<StageCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
