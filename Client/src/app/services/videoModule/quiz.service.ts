import { Injectable } from '@angular/core';
import quiz from '../../../assets/static/quizQuestions.json';


@Injectable({
  providedIn: 'root'
})

export class QuizService {
  enviromentUrl = 'http://localhost:4200/';
  constructor( ) { }

  getModuleLink(){
    return this.enviromentUrl + '/videoModule';
  }
  getQuiz() {
    return quiz;
  }
}
