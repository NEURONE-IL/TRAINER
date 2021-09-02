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
    // console.log(this.quiz);
  }

  sendQuizResponse(value) {
    this.newItemEvent.emit(value);
  }

  increaseExercise(lastExercise) {
    if(!lastExercise) {
      this.exerciseActual++;
    }
  }

  decreaseExercise(firstExercise) {
    if(!firstExercise){
      this.exerciseActual--;
    }
  }

  sendQuiz() {
    console.log('Enviando quiz jeje');
  }

  editExercise() {
    console.log('Editar el ejercicio ' + this.exerciseActual);
  }

  saveExercise() {
    console.log('Guardar el ejercicio');
  }
}

