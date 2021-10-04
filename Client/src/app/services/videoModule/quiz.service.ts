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

  getAnswer(questionId: any): Observable<any>{
    return this.http.get(this.uri + '/' + questionId, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  saveAnswer(answer: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('currentUser', ));
    //necesito stage y flujo
    answer["userId"] = user['_id'];
    return this.http.post(this.uri, answer, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  updateAnswer(answer: any, questionId: any): Observable<any> {
    return this.http.put(this.uri + '/' + questionId, answer, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

}

