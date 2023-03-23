import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { trigger, state, style, transition, animate } from '@angular/animations';

import { Flow } from '../../interfaces/flow.interface';
import { User } from '../../interfaces/user.interface';
import { Module } from '../../interfaces/module.interface';

import { MatDialog } from '@angular/material/dialog';
import { DescriptionDialogComponent } from '../../components/description-dialog/description-dialog.component';
import { ModuleService } from 'src/app/services/trainer/module.service';
import { TrainerUserUIService } from '../../services/trainer-user-ui.service';
import { StageService } from 'src/app/services/trainer/stage.service';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ModulosComponent implements OnInit {

  @Input() flow: Flow;
  @Input() user: User;
  @Input() flowId: string;
  @Input() lastStagePlayedId: string;
  @Input() userFlowModules: any;
  @Input() moduloID: string;

  modulosFiltrados;

  columnHeader  : string[] = ['NombreCol', 'TipoCol', 'DescriptionCol'];

  descriptionDialog : DescriptionDialogComponent;

  stageSuggestion : any;

  constructor(
    private dialog: MatDialog,
    private trainerUserUIService : TrainerUserUIService

  ) { }

  ngOnInit() {

    //actualizar el boton continuar
    if(this.lastStagePlayedId){
      //obtener etapa en userFlow
      this.stageSuggestion = this.getLastStagePlayed(this.lastStagePlayedId, this.userFlowModules)
    }
    else{
      // console.log("no suggested stage found");
    }
    
    this.modulosFiltrados = this.userFlowModules.filter(objModulo => objModulo.stages.length > 0);
  
  }

  getLastStagePlayed(stageId, userFlowModules){
    let objEtapaAux;

    userFlowModules.forEach(objModulo => {
      objModulo.stages.forEach(objEtapa => {
        if(stageId == objEtapa.stage._id){
          objEtapaAux = objEtapa; 
        }
      });
    });
    // console.log("getLastStagePlayed: ", objEtapaAux);
    
    return objEtapaAux;
  }

  getEtapasCompletadas(objModulo){
    let total = 0;

    objModulo.stages.forEach( objEtapa => {
      if(objEtapa.completed == true) total ++;
    });

    return total;
  }

  enClick(event: MouseEvent, row: any){

    event.preventDefault();
    event.stopPropagation();
    
    let objEvento = {
      user: this.user._id,
      flow: this.flow._id,
      module: null,
      eventDescription: ""
    }

    this.moduloID = this.moduloID == row.module._id ?  "" : row.module._id; 

    if(this.moduloID){
      objEvento.module = this.moduloID;
      objEvento.eventDescription = "User has opened module " + this.moduloID;
    }
    else{
      objEvento.module = row.module._id;
      objEvento.eventDescription = "User has closed module " + row.module._id;
    }
    
    //registrar evento de clickeo de modulo
    this.trainerUserUIService.saveEvent(objEvento).subscribe();
  }

  // para abrir ventana de descripcion
  openDialog(event: MouseEvent, modulo: Module) {

    event.preventDefault();
    event.stopPropagation();

    let objEvento = {
      user: this.user._id,
      flow: this.flowId,
      module: modulo._id,
      eventDescription: "User has clicked on module description " + modulo._id
    }

    this.trainerUserUIService.saveEvent(objEvento).subscribe();

    const dialogRef = this.dialog.open(DescriptionDialogComponent, { data: modulo });

    dialogRef.afterClosed().subscribe(() => {
      let objEventoClose = {
        user: this.user._id,
        flow: this.flowId,
        module: modulo._id,
        eventDescription: "User has closed module description dialog " + modulo._id
      }

      this.trainerUserUIService.saveEvent(objEventoClose).subscribe();
    });
  }

  goToStage(stage){

    // console.log("etapa ingresada: ", stage);

    let objEvento = {
      user: this.user._id,
      flow: this.flowId,
      module: this.moduloID,
      stage: stage._id,
      eventDescription: "User has clicked on continue button " + stage._id
    }

    this.trainerUserUIService.saveEvent(objEvento).subscribe();
    
    this.trainerUserUIService.redirectToStage(stage, this.user);
  }

}