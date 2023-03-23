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

  environmentUrl = environment.serverRoot;
  frontUrl= environment.frontURL;
  environmentApiUrl = environment.apiURL;
  uri = this.environmentApiUrl + 'videoModule/';
  uriVideoObjects = this.environmentApiUrl + 'videoObjects/';
  uriQuizObjects = this.environmentApiUrl + 'quizObjects/';
  uriEvents = this.environmentApiUrl + 'eventsVideoModule/';
  uriImage = this.environmentApiUrl + 'image/';

  constructor( protected http: HttpClient) { }

  /*
  * Handle images */
  getImage(fileName){
    return this.http.get(this.uriImage + '/' + fileName, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getImages(){
    return this.http.get(this.uriImage, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  saveImage(file:any){
    console.log("FRONT END:")
    console.log(file)
    return this.http.post(this.uriImage, file, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  /*
  * Handle links*/

  getVideoLink(videoStageId: any){
    return this.environmentUrl + 'video?id=' + videoStageId;
  }

  getVideoQuizLink(videoQuizStageId: any){
    console.log(this.frontUrl)
    return this.frontUrl + 'videoModule?id=' + videoQuizStageId;
  }


  /*
  * Handle quiz answers
  */

  getAnswer(questionId: any, userId: any, stageId: any, flowId: any): Observable<any>{
    return this.http.get(this.uri + '/' + questionId + '/' + userId + '/' + stageId + '/' + flowId, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  saveAnswer(answer: any, userId: any, stageId: any, flowId: any): Observable<any> {
    answer.userId = userId;
    answer.stageId = stageId;
    answer.flowId = flowId;
    return this.http.post(this.uri, answer, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  updateAnswer(answer: any, questionId: any, userId: any, stageId: any, flowId: any): Observable<any> {
    answer.userId = userId;
    answer.stageId = stageId;
    answer.flowId = flowId;
    return this.http.put(this.uri + '/' + questionId + '/' + userId + '/' + stageId + '/' + flowId, answer, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }


  /*
  * Handle events*/

  handleEvent(event: string, component: string, userId: any, stageId: any, flowId: any): Observable<any>{
    const value = {
      userId,
      stageId,
      flowId,
      component,
      event
    };

    console.log('- - - Quiz Service - - -');
    console.log(' - Evento: ', value);
    console.log(' - Consulta: ', this.uriEvents);

    return this.http.post(this.uriEvents, value, {headers: {'x-access-token': localStorage.getItem('auth_token')} });
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

  getQuizzesByUser(userId): Observable<any> {
    return this.http.get(this.uriQuizObjects+'byUser/'+userId);
  }

  // Get one quiz by id
  getQuiz(quizId: number): Observable<any> {
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

