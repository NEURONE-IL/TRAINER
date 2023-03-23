import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { ApiTriviaService } from '../../services/apiTrivia/apiTrivia.service';
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

  // 0: ignorar eventos 
  // 1: registrar eventos
  flagRegistrarEventos = 1; 

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

  getTotalProgress(user){
    
    let totalProgress = forkJoin([
      this.triviaService.getProgress(user._id)
        .pipe(
          timeout(1000),
          catchError(err => of('error: ', err))),
      // this.apiSGService.getProgress(user._id).pipe(catchError(err => of(err))),
      // this.videoService.getVideoProgress(),
      // this.videoQuizService.getVideoQuizProgress()
    ]);
    
    return totalProgress;
  }

  getUserFlow(studentId: string): Observable<any> {
    return this.http.get(environment.apiURL + 'userFlow/getProgress/' + studentId, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  updateUserFlow(userFlow, newModules: any): Observable<any> {
    let objeto = {
      modules: newModules
    }

    let allModulesCompleted = newModules.every(objModule => (objModule.completed == true));

    if(allModulesCompleted && !userFlow.finished){
      objeto['finished'] = true;
    }
    
    // console.log("objeto a enviar", objeto);
    
    return this.http.put(environment.apiURL + 'userFlow/updateProgress/' + userFlow.user, objeto, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  updateLastStagePlayed(userId, stageId: string): Observable<any> {
    console.log("actualizando lastStagePlayed");

    let objeto = {
      lastStagePlayed: stageId
    }
    
    return this.http.put(environment.apiURL + 'userFlow/updateProgress/' + userId, objeto, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  redirectToStage(stage, user){
    localStorage.setItem('stageId', stage._id);

    this.updateLastStagePlayed(user._id, stage._id).subscribe(resp => {
      console.log("actualizando lastStagePlayed:", resp);
      
    });

    if (stage.type === 'Video'){
      window.location.href = this.videoModuleService.getVideoLink(stage.externalId);
    }
    if (stage.type === 'Video + Quiz'){
      //http://localhost:3070/api/stage/stage._id  
      window.location.href = this.videoModuleService.getVideoQuizLink(stage.externalId);
    }
    if (stage.type === 'Trivia'){
      window.location.href = this.triviaService.getStudyLink(stage.externalId, user);
    }
    if (stage.type === 'Adventure'){
      window.location.href = this.apiSGService.getAdventureLink(stage.externalId);
    }

  }

  //para la captura de eventos
  //modulo desplegado o cerrado
  //descripcion de modulo clickeado
  //etapa clickeada
  //boton continuar clickeado
  //medalla clickeada

  saveEvent(objEvento){

    //activar flagRegistrarEventos (cambiar su valor a 1) para empezar a guardar acciones en BD.

    let localTime = new Date();

    if(this.flagRegistrarEventos){
      objEvento.localTimeStamp = localTime;
      console.log("evento registrado: ", objEvento);
      return this.http.post(environment.apiURL + 'userEvent', objEvento, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
    }

    else{
      return of();
    }
  }

}
