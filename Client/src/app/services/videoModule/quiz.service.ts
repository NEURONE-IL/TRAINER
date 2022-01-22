import { Injectable } from '@angular/core';
import quiz from '../../../assets/static/quizQuestions.json';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {StageService} from '../trainer/stage.service';
import videos from '../../../assets/static/videoObjects.json';


export interface VideoModule {
  variablePrueba: string;
}

@Injectable({
  providedIn: 'root'
})

export class QuizService {

  enviromentUrl = 'http://localhost:4200/';
  uri = environment.apiURL + 'videoModule';
  urlServer = 'http://138.197.200.50:3070/';
  constructor( protected http: HttpClient,
               private stageService: StageService) { }

  getVideoLink(videoStageId: any){
    return this.urlServer + 'video?id=' + videoStageId;
  }

  deleteVideo(id: number) {
    let finalJson = [];
    let videosJson = videos;
    for (let video of videosJson) {
      console.log(video["_id"])
      if (video["_id"] === id){
        console.log("Se elimina esta shit");
        console.log("Index: ", videosJson.indexOf(video));
      }
      else{
        finalJson.push(video);
      }
    }
    console.log(finalJson);

  }

  getVideoQuizLink(videoQuizStageId: any){
    return this.urlServer + 'videoModule?id=' + videoQuizStageId;
  }

  getQuiz() {
    const user = JSON.parse(localStorage.getItem('currentUser', ));
    /*const stage = this.stageService.getStageByStudent(user['_id']).subscribe((res) => {
    }) ESTO TIRA CORE CRASHED*/
    console.log("get quiz");
    console.log(quiz);
    return quiz;
  }

  getVideos() {
    console.log("GETTING VIDEOS");
    return videos;
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

  handleEvent(event: String, component: String): Observable<any>{
    console.log("HANDLE EVENT SERVICE");
    const user = JSON.parse(localStorage.getItem('currentUser', ));
    // falta stage y flow
    let value = {
      "userId": user['_id'],
      "component": component,
      "event": event
    };

    console.log("Evento: ", value);
    let urlEvents = environment.apiURL + 'eventsVideoModule/';
    console.log("Consulta: ", urlEvents);

    return this.http.post(urlEvents, value, {headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }


}

