import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterStudentComponent } from './registerStudent.component';

describe('RegisterStudentComponent', () => {
  let component: RegisterStudentComponent;
  let fixture: ComponentFixture<RegisterStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterStudentComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
