import { Component, OnInit } from '@angular/core';

import { TrainerUserUIService } from '../../services/trainer-user-ui.service';

import { Flow } from '../../interfaces/flow.interface';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../../services/auth/auth.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FlowService } from 'src/app/services/trainer/flow.service';
import { TimerDialogComponent } from '../../components/timer-dialog/timer-dialog.component';
import { ActionsTrackerService } from 'src/app/services/logger/actions-tracker.service';
import { KmTrackerService } from 'src/app/services/logger/km-tracker.service';

@Component({
  selector: 'app-flujos',
  templateUrl: './flujos.component.html',
  styleUrls: ['./flujos.component.css']
})
export class FlujosComponent implements OnInit{

  flow                : Flow;
  flowId              : string;
  user                : User;

  userFlow            : any;
  updatedModules      : any;

  moduleToDisplay     : string;

  totalDeModulos      : number;
  totalDeEtapas       : number;
  
  modulosCompletados  : number = 0;
  etapasCompletadas   : number = 0;


  constructor(
    private flowService           : FlowService,
    private trainerUserUIService  : TrainerUserUIService,
    private authService           : AuthService,
    private dialog                : MatDialog
  ) { }

  ngOnInit(): void {
    
    //conseguir datos del usuario
    this.user = this.authService.getUser()
    console.log(this.user);
    
    //guardar id del flujo
    this.flowId = this.user.flow;
    
    //obtener datos del flujo
    this.obtenerFlujo( this.flowId );

    //obtener el progreso total del usuario guardado en userFlow
    this.trainerUserUIService.getUserFlow(this.user._id).subscribe( respUserFlow => {
      this.userFlow = respUserFlow.userFlow;
      console.log("userFlow: ", this.userFlow);
      
      //obtener progreso de ambientes externos para actualizar el progreso total
      this.updatedModules = this.userFlow.modules;

      console.log("userFlowModulesAux: ", this.updatedModules);

      this.trainerUserUIService.getTotalProgress(this.user).subscribe(
        progresoTotal => {

          console.log("respuesta getTotalProgress: ", progresoTotal);

          //actualizar con los estudios obtenidos de TRIVIA (si es que no hay errores)
          if(progresoTotal[0]['progress']){
            
            let triviaProgress = progresoTotal[0]['progress'];
            
            triviaProgress.forEach( (objProgress) =>{
              // console.log("objProgress: ", objProgress);
              
              this.userFlow.modules.forEach( (objModulo, j) => {
                // console.log('objModulo: ', objModulo);
                
                objModulo.stages.forEach( (objEtapa, k) => {
                  // console.log("objEtapa: ", objEtapa);
                  if(objProgress.study._id == objEtapa.stage.externalId){
                    this.updatedModules[j].stages[k].completed = objProgress.finished
                    this.updatedModules[j].stages[k].completedAt = objProgress.finishedAt
                    this.updatedModules[j].stages[k].percentage = objProgress.percentage * 100
                  }
                });
              });
            });
          }

          
          // //actualizar con los estudios obtenidos de ADVENTURE
          // if(progresoTotal[1]['progress']){
            // let adventureProgress = progresoTotal[1]['progress'];

            // adventureProgress.forEach( (objProgress) =>{
            //   // console.log("objProgress: ", objProgress);
              
            //   this.userFlow.modules.forEach( (objModulo, j) => {
            //     // console.log('objModulo: ', objModulo);
                
            //     objModulo.stages.forEach( (objEtapa, k) => {
            //       // console.log("objEtapa: ", objEtapa);
            //       if(objProgress.study._id == objEtapa.stage.externalId){
            //         userFlowModulesAux[j].stages[k].completed = objProgress.finished
            //         userFlowModulesAux[j].stages[k].completedAt = objProgress.finishedAt
            //         userFlowModulesAux[j].stages[k].percentage = objProgress.percentage * 100
            //       }
            //     });
            //   });
            // });
          // }

        if(this.flow.sorted){
          this.updatedModules = this.unlockNextElements(this.updatedModules);
        }

        //obtener modulo a desplegar
        this.moduleToDisplay = this.getModuleToDisplay(this.updatedModules);

        //guardar en BD nuevo progreso
        this.trainerUserUIService.updateUserFlow(this.userFlow, this.updatedModules).subscribe();
        

        this.totalDeModulos = this.updatedModules.length;
        this.totalDeEtapas = this.obtenerTotalDeEtapas(this.updatedModules);
        this.modulosCompletados = this.obtenerModulosCompletados(this.updatedModules);
        this.etapasCompletadas = this.obtenerEtapasCompletadas(this.updatedModules);
        
      });

    });

    //TODO: bloquear usuario en caso de que haya cumplido su cuota de niveles por dia
    // if(etapasPorCompletar == 0){
    // this.openTimerDialog();
    // }
  }

  //obtiene el objeto del flujo a través de un id

  obtenerFlujo(id: string){
    this.flowService.getFlow(id)
      .subscribe( (resp) => {
        this.flow = resp.flow;
        },
        (err) => {
        console.error(err);
        }
      )
  }

  getModuleToDisplay(userFlowModules){
    
    let objModulo = userFlowModules.find(objModuloAux => objModuloAux.completed == false);
    
    if(objModulo){
      return objModulo.module._id;
    }
    else{
      return "";
    }
  }


  unlockNextElements(userFlowModules){
    let userFlowModulesAux = userFlowModules;

    //revisar si todas las etapas de un modulo estan completadas
    userFlowModules.forEach((objModule, i) => {

      let todasCompletadas

      todasCompletadas = objModule.stages.every(objEtapa => (objEtapa.completed == true));
      if(todasCompletadas && !userFlowModulesAux[i].completed){
        userFlowModulesAux[i].completed = true;
      }     

      if(i > 0){
     
        if(userFlowModulesAux[i-1].completed){        
          userFlowModulesAux[i].active = true;
        }
      }

      //desbloquear todas las etapas con el minimo step sin completar
      let minStepObj;
      minStepObj = objModule.stages.find(objStage => objStage.completed == false);

      if(minStepObj){
        objModule.stages.forEach((objEtapa, j) => {


          if(objEtapa.stage.step == minStepObj.stage.step){
            userFlowModulesAux[i].stages[j].active = true;
          }
        });
      }

    });
    
    return userFlowModulesAux;
  }

  obtenerTotalDeEtapas( modulos ){
    let total = 0;
    
    modulos.forEach( objModulo => {
      total += objModulo.stages.length;
    });

    return total;
  }

  obtenerModulosCompletados( modulos ){
    let total = 0;
    
    modulos.forEach( objModulo => {
      if(objModulo.completed == true) total++;
    });

    return total;
  }

  obtenerEtapasCompletadas( modulos ){
    let total = 0;

    modulos.forEach( objModulo => {
      objModulo.stages.forEach( objEtapa => {
        if(objEtapa.completed == true) total++;
      });
    });
    
    return total;
  }

  //TODO: maquetado de una ventana emergente para bloquear al usuario. De momento no se ocupa
  openTimerDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      user: this.user,
      timer: true,
      test: 'prueba'
    }
    
    this.dialog.open(TimerDialogComponent, dialogConfig)
  }
}
