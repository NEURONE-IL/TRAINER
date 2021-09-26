import { Injectable } from '@angular/core';
import quiz from '../../../assets/static/quizQuestions.json';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

export interface VideoModule {
  variablePrueba: string;
}

@Injectable({
  providedIn: 'root'
})

export class QuizService {
  enviromentUrl = 'http://localhost:4200/';
  uri = environment.apiURL + 'videoModule';
  constructor( protected http: HttpClient ) { }

  getModuleLink(){
    return this.enviromentUrl + 'videoModule/';
  }
  getQuiz() {
    return quiz;
  }

  saveAnswer(answer: any): Observable<any> {
    console.log('quiz service ts');
    return this.http.post(this.uri, answer, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
}

