import { Component, Input, OnInit } from '@angular/core';
import { Stage } from 'src/app/services/trainer/stage.service';
import { Output, EventEmitter } from '@angular/core';
import { QuizService } from 'src/app/services/videoModule/quiz.service';
import { ApiTriviaService } from 'src/app/services/apiTrivia/apiTrivia.service';
import { ApiSGService } from '../../services/apiSG/apiSG.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Module } from 'src/app/services/trainer/module.service';

@Component({
  selector: 'show-stages',
  templateUrl: './show-stages.component.html',
  styleUrls: ['./show-stages.component.css']
})
export class ShowStagesComponent implements OnInit {

  constructor(

    private videoModuleService: QuizService,
    private triviaService: ApiTriviaService,
    private apiSGService: ApiSGService,
    private router: Router,
    private authService: AuthService

  ) {}

  stagesByModule: any[] = [];
  accessStage: number = 1;


  @Input() sorted: boolean;
  @Input() modulo: any;



  ngOnInit(): void {

    if(this.sorted){

      this.stagesByModule = this.modulo.stages.sort((n1,n2) => {
        return n1.step - n2.step;
      });

      //prueba para manejar etapas completadas
      this.stagesByModule.forEach((stage) => {
        stage["percentage"] = 0;
        
      })
      console.log(this.stagesByModule);
      
      this.accessStage = this.extractCurrentLevel(this.stagesByModule);
    }

    else{
      this.stagesByModule = this.modulo.stages
    }
    
  }
  
  //se actualiza el nivel para desbloquear etapas correspondientes
  ngDoCheck(): void{

    this.accessStage = this.extractCurrentLevel(this.stagesByModule);
    
  }


  goToStage(stage){
    console.log(stage);
    if (stage.type === 'Video'){
      this.router.navigate(['/videoModule']);
    }
    if (stage.type === 'Trivia'){
      window.location.href = this.triviaService.getStudyLink(stage.externalId, this.authService.getUser());
    }
    if (stage.type === 'SG'){
      window.location.href = this.apiSGService.getAdventureLink(stage.externalId);
      return;
    }
  }

  //cambiar el tipo de stage a Stage(), lo deje en any para realizar pruebas con etapas completadas ya que asigno el elemento percentage al interface Stage
  extractCurrentLevel(stages: any[]) :number{
    let niveles: number[] = [];

    //extraer el valor de step de los niveles que no esten completados
    stages.forEach((etapa) => {
      //if no completado
      if(etapa.percentage < 100){
        niveles.push(etapa.step);
      }
    }      
    );
    //obtener el valor minimo y guardarlo en accessStage
    
    return Math.min.apply(null, niveles);

  }

  //funcion para completar etapa
  setPercentage(stage: any){
    stage.percentage = 100;
    
  }

}
