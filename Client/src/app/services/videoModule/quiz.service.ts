import {Injectable} from '@angular/core';
import quiz from '../../../assets/static/quizQuestions.json';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable, Subject} from 'rxjs';
import {StageService} from '../trainer/stage.service';


export interface VideoModule {
  variablePrueba: string;
}

@Injectable({
  providedIn: 'root'
})

export class QuizService {

  enviromentUrl = 'http://localhost:4200/';
  uri = environment.apiURL + 'videoModule/';
  urlServer = 'http://138.197.200.50:3070/';

  urlEnviroment = environment.frontURL;

  uriVideoObjects = environment.apiURL + 'videoObjects/';
  uriQuizObjects = environment.apiURL + 'quizObjects/';
  constructor( protected http: HttpClient,
               private stageService: StageService) { }

  getVideoLink(videoStageId: any){
    return this.enviromentUrl + 'video?id=' + videoStageId;
  }


  getVideoQuizLink(videoQuizStageId: any){
    return this.enviromentUrl + 'videoModule?id=' + videoQuizStageId;
  }

  getQuiz() {
    const user = JSON.parse(localStorage.getItem('currentUser', ));
    /*const stage = this.stageService.getStageByStudent(user['_id']).subscribe((res) => {
    }) ESTO TIRA CORE CRASHED*/
    console.log("get quiz");
    console.log(quiz);
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



  /*
  * Functions to handle videos
  **/

  // Returns all videos in a json
  getVideos(): Observable<any> {
    return this.http.get(this.uriVideoObjects, { headers: {'x-access-token': localStorage.getItem('auth_token')} } );
  }

  // Get one video by id
  getVideo(videoId: number): Observable<any> {
    return this.http.get(this.uriVideoObjects + videoId, { headers: {'x-access-token': localStorage.getItem('auth_token')} } );
  }

  // Delete a video
  deleteVideo(videoId: number): Observable<any> {
    return this.http.delete(this.uriVideoObjects + videoId, { headers: {'x-access-token': localStorage.getItem('auth_token')} } );
  }

  // Add a video {quiz_id <ObjectId>, name <String>, image_url <String>, video_url <String>, language <String>}
  addVideo(video: any): Observable<any> {
    return this.http.post(this.uriVideoObjects, video, { headers: {'x-access-token': localStorage.getItem('auth_token')} } );
  }


  /*
  * Functions to handle quizzes
  * */

  // Returns all quizzes in a json
  getQuizzes(): Observable<any> {
    return this.http.get(this.uriQuizObjects, { headers: {'x-access-token': localStorage.getItem('auth_token')} } );
  }

  // Get one quiz by id
  getQuiz2(quizId: number): Observable<any> {
    return this.http.get(this.uriQuizObjects + quizId, { headers: {'x-access-token': localStorage.getItem('auth_token')} } );
  }

  // Delete a video
  deleteQuiz(quizId: number): Observable<any> {
    return this.http.delete(this.uriQuizObjects + quizId, { headers: {'x-access-token': localStorage.getItem('auth_token')} } );
  }

  // Add a video {video_id <ObjectId>, name <String>, instructions <String>, resource_url <String>, exercises <String>}
  addQuiz(quiz: any): Observable<any> {
    return this.http.post(this.uriQuizObjects, quiz, { headers: {'x-access-token': localStorage.getItem('auth_token')} } );
  }


}

