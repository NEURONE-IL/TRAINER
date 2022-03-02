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
  @Input() progress: any;

  user: any;

  ngOnInit(): void {
    console.log(this.progress, 'progress');
    this.user = this.authService.getUser();

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

      stage["percentage"] = 0; //asignar a todas las etapas el atributo de porcentaje, inicializado en 0
    })

  }

  //se actualiza el nivel para desbloquear etapas correspondientes
  ngDoCheck(): void{

    this.accessStage = this.extractCurrentLevel(this.stagesByModule);

    //actualizar porcentaje de etapas si es que existe el arreglo de progreso
    this.stagesByModule.forEach((stage) => {

      let saved;  //elemento del arreglo de progreso

      if(this.progress){
        saved = this.progress.find(estudio => estudio.study._id == stage.externalId)
      }

      if(saved){
        stage.percentage = saved.percentage * 100;
      }
    })
  }


  goToStage(stage){
    /*
    console.log(stage);
    //Dispatch pageenter event
    var evt = new CustomEvent('stageenter', { detail: 'Enter to "' + stage._id + '" stage' });
    window.dispatchEvent(evt);
    //End dispatch pageenter event
    */
    if (stage.type === 'Video'){
      return this.videoModuleService.getVideoLink(stage.externalId);
    }
    if (stage.type === 'Video + Quiz'){
      return this.videoModuleService.getVideoQuizLink(stage.externalId);
    }    
    if (stage.type === 'Trivia'){
      return this.triviaService.getStudyLink(stage.externalId, this.user);
    }
    if (stage.type === 'SG'){
      return this.apiSGService.getAdventureLink(stage.externalId);
    }
  }

  redirectToStage(stage){
    localStorage.setItem('stageId', stage);
//    window.location.href = this.goToStage(stage);
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
      stage.percentage = 100;
    }
  }

  getIcon(tipo: string): string {
    if(tipo == "Trivia"){
      return '../../../assets/stage-images/TriviaIconGold.svg'
    }
    
    else if(tipo == "Video"){
      return '../../../assets/stage-images/VideoIconGold.svg'
    }

    else if(tipo == "SG"){
      return '../../../assets/stage-images/AdventureIconBronze.svg'
    }

    else if(tipo == "Video + Quiz"){
      return '../../../assets/stage-images/videoQuiz.svg'
    }

    else{
      return '../../../assets/stage-images/notFound.svg'
    }

  }
}
