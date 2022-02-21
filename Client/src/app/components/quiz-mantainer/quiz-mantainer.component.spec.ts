import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizMantainerComponent } from './quiz-mantainer.component';

describe('QuizMantainerComponent', () => {
  let component: QuizMantainerComponent;
  let fixture: ComponentFixture<QuizMantainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizMantainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizMantainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
