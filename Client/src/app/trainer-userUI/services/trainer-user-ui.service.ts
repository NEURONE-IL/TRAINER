//Archivo para hacer pruebas con servicios. Al finalizar conectar
//con los servicios reales (cambiando nombre de servicios en constructores).

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Flow } from '../interfaces/flow.interface';
import { ApiTriviaService } from '../../services/apiTrivia/apiTrivia.service';
import { Stage } from '../interfaces/stage.interface';
import { QuizService } from 'src/app/services/videoModule/quiz.service';
import { ApiSGService } from 'src/app/services/apiSG/apiSG.service';

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
  
  modulosTotal  : number = 0;
  etapasTotal   : number = 0;
  modulosCompletados  : number = 0;
  etapasCompletadas   : number = 0;

  indiceEncontrado  : boolean = false;

  nextStage : Stage;

  constructor( protected http: HttpClient,
               private triviaService: ApiTriviaService,
               private videoModuleService: QuizService,
               private apiSGService: ApiSGService,
              ) { }

  // observable de prueba con el progreso de aventura (TODO: borrar)
  progresoAventura():Observable<any>{
    return of({
      progress: [
        {
          adventure: {
            _id: "60ddfaf8d02afa10bf93676d",
            name: "Aventura en el espacio",
            description: "No sé"
          },
          completed: true,
          percentage: 1
        },
        {
          adventure: {
            _id: "60de1794d02afa10bf936a1b",
            name: "aventura 2",
            description: "avnetura 2"
          },
          completed: false,
          percentage: 0
        }
      ]
    });
  }

  //hasta aqui


  setModulosCompletados() {
    let base = +localStorage.getItem('modulosCompletados');
    localStorage.setItem('modulosCompletados', (base + 1).toString());
  }

  setEtapasCompletadas(){
    let base = +localStorage.getItem('etapasCompletadas');
    localStorage.setItem('etapasCompletadas', (base + 1).toString());
  }

  getTotalProgress(user){
    //prueba para verificar como funciona forkjoin
    let totalProgress = forkJoin([this.triviaService.getProgress(user._id), this.progresoAventura()]);
    return totalProgress;

    //TODO: unificar los progresos de todos los ambientes
    //(llamando los metodos que obtienen el progreso de sus respectivos servicios)
    // return forkJoin([
    //    this.triviaService.getProgress(this.getUser()._id),
    //    this.adventureService.getAdventureProgress(),
    //    this.videoService.getVideoProgress(),
    //    this.videoQuizService.getVideoQuizProgress()
    // ]);
  }

  redirectToStage(stage, user){
    localStorage.setItem('stageId', stage._id);
    
    if (stage.type === 'Video'){
      window.location.href = this.videoModuleService.getVideoLink(stage.externalId);
    }
    if (stage.type === 'Video + Quiz'){
      window.location.href = this.videoModuleService.getVideoQuizLink(stage.externalId);
    }
    if (stage.type === 'Trivia'){
      window.location.href = this.triviaService.getStudyLink(stage.externalId, user);
    }
    if (stage.type === 'Adventure'){
      window.location.href = this.apiSGService.getAdventureLink(stage.externalId);
    }

  }

  // //obtine el usuario de localStorage
  // public getUser() {
  //   return JSON.parse(localStorage.getItem('currentUser'));
  // }

  // //obtiene el objeto del flujo
  // getFlow(id: string): Observable<any> {
  //   return this.http.get(this.uriFlow+id, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  // }

  // //obtiene los modulos de un flujo
  // getModuleByFlow(flowId: string): Observable<any> {
  //   return this.http.get(this.uriModule + 'byFlow/' + flowId, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  // }

  // getStageById(id: string) {
  //   return this.http.get(this.uriStage+id, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  // }


  // //TRIVIA

  // getStudyLink(idStudio) {
  //   let user = JSON.parse(localStorage.getItem('currentUser'));
  //   let apiKey = 't4u9x30msmmiq56m5rhmtf9fn3r1lk';
  //   return 'http://159.65.100.191:3030/login_redirect/' + user.email + '/' + user.names + '/' + idStudio + '/' + user._id + '/' + apiKey + '/http:--localhost:4200-home';
  // }

  // //ADVENTURE
  // // urlApi = 'http://143.198.136.174:3002/';
  // getAdventureLink(idAdventure) {
  //   let user = JSON.parse(localStorage.getItem('currentUser'));
  //   let apiKey = 'wxlsdn2i3fviyqff31nw6dsvqxolka';
  //   return 'http://143.198.136.174:3002/login_redirect/' + user.email + '/' + user.names + '/' + idAdventure + '/' + user._id + '/' + apiKey + '/http:--localhost:4200-home';
  // }

  // //VIDEO
  // //link de ejemplo http://138.197.200.50:3070/video?id=1
  
  // urlServer = 'http://138.197.200.50:3070/';

  // getVideoLink(videoStageId: any){
  //   let link = this.urlServer + 'video?id=' + videoStageId;
    
  //   return this.urlServer + 'video?id=' + videoStageId;
  // }

  // getVideoQuizLink(videoQuizStageId: any){
  //   return this.urlServer + 'videoModule?id=' + videoQuizStageId;
  // }


  // //PROGRESO
  // getProgress(userId){
  //   let apiKey = 't4u9x30msmmiq56m5rhmtf9fn3r1lk';
  //   let header = new HttpHeaders();
  //   // let urlApi = 'http://159.65.100.191:3030/api/';
  //   let urlApi = 'http://159.89.132.126:3030/api/'; //trivia dev
  //   header = header.append('Content-Type', 'application/json');
  //   header = header.append('x-api-key', apiKey);
  //   return this.http.get(urlApi + 'user/' + userId + '/advance', { headers: header });
  // }

}
