import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLandPageComponent } from './studentLandPage.component';

describe('StudentLandPageComponent', () => {
  let component: StudentLandPageComponent;
  let fixture: ComponentFixture<StudentLandPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentLandPageComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentLandPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
