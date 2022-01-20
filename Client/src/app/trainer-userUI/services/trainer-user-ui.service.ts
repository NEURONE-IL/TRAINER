//Archivo para hacer pruebas con servicios. Al finalizar conectar
//con los servicios reales (cambiando nombre de servicios en constructores).

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Flow } from '../interfaces/flow.interface';

@Injectable({
  providedIn: 'root'
})
export class TrainerUserUIService {

  //environment
  // serverRoot: 'http://localhost:3070/',
  // apiURL: 'http://localhost:3070/api/',
  // frontURL: 'http://localhost:3070/',
  // locale: 'es-CL'

  uriFlow = environment.apiURL + 'flow/';
  uriModule = environment.apiURL + 'module/';
  uriStage = environment.apiURL + 'stage/';
  constructor( protected http: HttpClient) { }

  //obtine el usuario de localStorage
  public getUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  //obtiene el objeto del flujo
  getFlow(id: string): Observable<any> {
    return this.http.get(this.uriFlow+id, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  //obtiene los modulos de un flujo
  getModuleByFlow(flowId: string): Observable<any> {
    return this.http.get(this.uriModule + 'byFlow/' + flowId, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getStageById(id: string) {
    return this.http.get(this.uriStage+id, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }


  //TRIVIA

  getStudyLink(idStudio) {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    let apiKey = 't4u9x30msmmiq56m5rhmtf9fn3r1lk';
    return 'http://159.65.100.191:3030/login_redirect/' + user.email + '/' + user.names + '/' + idStudio + '/' + user._id + '/' + apiKey + '/http:--localhost:4200-home';
  }

  //ADVENTURE
  // urlApi = 'http://143.198.136.174:3002/';
  getAdventureLink(idAdventure) {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    let apiKey = 'wxlsdn2i3fviyqff31nw6dsvqxolka';
    return 'http://143.198.136.174:3002/login_redirect/' + user.email + '/' + user.names + '/' + idAdventure + '/' + user._id + '/' + apiKey + '/http:--localhost:4200-home';
  }

  //VIDEO
  //link de ejemplo http://138.197.200.50:3070/video?id=1
  
  urlServer = 'http://138.197.200.50:3070/';

  getVideoLink(videoStageId: any){
    let link = this.urlServer + 'video?id=' + videoStageId;
    
    return this.urlServer + 'video?id=' + videoStageId;
  }

  getVideoQuizLink(videoQuizStageId: any){
    return this.urlServer + 'videoModule?id=' + videoQuizStageId;
  }


  //PROGRESO
  getProgress(userId){
    let apiKey = 't4u9x30msmmiq56m5rhmtf9fn3r1lk';
    let header = new HttpHeaders();
    let urlApi = 'http://159.65.100.191:3030/api/';
    // let urlApi = 'http://159.89.132.126:3030/api/'; //trivia dev
    header = header.append('Content-Type', 'application/json');
    header = header.append('x-api-key', apiKey);
    return this.http.get(urlApi + 'user/' + userId + '/advance', { headers: header });
  }
  
}
