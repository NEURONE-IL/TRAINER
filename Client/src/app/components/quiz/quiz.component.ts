import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  encapsulation: ViewEncapsulation.Emulated, // ??
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  @Input() quizNumber: number;
  @Output() newItemEvent = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  sendQuizResponse() {
    const send = 'quiz ' + this.quizNumber.toString(10) + ' listo!'
    this.newItemEvent.emit(send);
  }


}

