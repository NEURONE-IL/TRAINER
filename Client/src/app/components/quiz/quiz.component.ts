import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
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

  questions;

  constructor( private quizService: QuizService ) {  }

  ngOnInit(): void {
    this.getQuestions();
  }

  getQuestions() {
    this.questions = this.quizService.getQuestions();
    console.log(this.questions);
  }

  sendQuizResponse() {
    this.getQuestions();
    const send = 'quiz ' + this.quizNumber.toString(10) + ' listo!';
    this.newItemEvent.emit(send);
  }


}

