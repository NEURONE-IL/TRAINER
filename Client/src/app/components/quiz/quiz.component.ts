import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { QuizService } from '../../services/videoModule/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  encapsulation: ViewEncapsulation.Emulated, // ??
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  @Input() quizNumber: number;
  @Output() newItemEvent = new EventEmitter<string>();

  quiz;
  exerciseActual;

  constructor(private quizService: QuizService) {  }

  ngOnInit(): void {
    this.getQuiz();
    this.exerciseActual = 0;
  }

  getQuiz() {
    this.quiz = this.quizService.getQuiz();
    console.log(this.quiz);
  }

  sendQuizResponse(value) {
    this.newItemEvent.emit(value);
  }

  increaseExercise() {
    this.exerciseActual++;
  }

  decreaseExercise() {
    this.exerciseActual--;
  }
}

