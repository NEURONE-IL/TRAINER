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

      this.accessStage = this.extractCurrentLevel(this.stagesByModule);
    }

    else{
      this.stagesByModule = this.modulo.stages
    }

    //prueba para manejar etapas completadas
    this.stagesByModule.forEach((stage) => {
      stage["percentage"] = 0;

    })

  }

  //se actualiza el nivel para desbloquear etapas correspondientes
  ngDoCheck(): void{

    this.accessStage = this.extractCurrentLevel(this.stagesByModule);

  }


  goToStage(stage){
    console.log(stage);
    /*Dispatch pageenter event*/
    var evt = new CustomEvent('stageenter', { detail: 'Enter to "' + stage._id + '" stage' });
    window.dispatchEvent(evt);
    /*End dispatch pageenter event*/
    if (stage.type === 'Video'){
      window.location.href = this.videoModuleService.getVideoLink(stage.externalId);
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

  //funcion para simular completado de etapa
  addPercentage(stage: any){
    if(stage.percentage < 100){
      stage.percentage = stage.percentage + 25;
    }
  }

  getIcon(tipo: string, porcentaje: number): string {
    switch(tipo){
      case "Trivia":
        if(porcentaje >= 50 && porcentaje < 75){
          return '../../../assets/stage-images/TriviaIconBronze.svg'
        }
        else if(porcentaje >= 75 && porcentaje < 90){
          return '../../../assets/stage-images/TriviaIconSilver.svg'
        }
        else if(porcentaje >= 90){
          return '../../../assets/stage-images/TriviaIconGold.svg'
        }
        else{
          return '../../../assets/stage-images/TriviaIcon.svg'
        }
        break;

      case "Video":
        if(porcentaje >= 50 && porcentaje < 75){
          return '../../../assets/stage-images/VideoIconBronze.svg'
        }
        else if(porcentaje >= 75 && porcentaje < 90){
          return '../../../assets/stage-images/VideoIconSilver.svg'
        }
        else if(porcentaje >= 90){
          return '../../../assets/stage-images/VideoIconGold.svg'
        }
        else{
          return '../../../assets/stage-images/VideoIcon.svg'
        }
        break;

      case "SG":
        if(porcentaje >= 50 && porcentaje < 75){
          return '../../../assets/stage-images/AdventureIconBronze.svg'
        }
        else if(porcentaje >= 75 && porcentaje < 90){
          return '../../../assets/stage-images/AdventureIcon.svg'
        }
        else if(porcentaje >= 90){
          return '../../../assets/stage-images/AdventureIconBronze.svg'
        }
        else{
          return '../../../assets/stage-images/AdventureIcon.svg'
        }
        break;

      default:
        return ""
    }

  }
}
