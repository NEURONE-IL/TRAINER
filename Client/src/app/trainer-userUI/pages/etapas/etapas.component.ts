import { Component, Input, OnInit } from '@angular/core';
import { ApiSGService } from 'src/app/services/apiSG/apiSG.service';
import { ApiTriviaService } from 'src/app/services/apiTrivia/apiTrivia.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { QuizService } from 'src/app/services/videoModule/quiz.service';
import { Stage, StudyProgress } from '../../interfaces/stage.interface';
import { User } from '../../interfaces/user.interface';
import { Module } from 'src/app/trainer-userUI/interfaces/module.interface';
import { TrainerUserUIService } from '../../services/trainer-user-ui.service';

@Component({
  selector: 'app-etapas',
  templateUrl: './etapas.component.html',
  styleUrls: ['./etapas.component.css']
})
export class EtapasComponent implements OnInit{

  @Input() modulo: Module;
  @Input() sorted: boolean;

  stagesByModule  : Stage[] = [];
  accessStage     : number = 1;
  user            : User;
  triviaProgress  : StudyProgress[] = [];


  constructor(  private authService: AuthService,
                private videoModuleService: QuizService,
                private triviaService: ApiTriviaService,
                private apiSGService: ApiSGService,
                private trainerUserUIService: TrainerUserUIService) { }

  ngOnInit(): void {

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

    console.log(this.stagesByModule);
    

    //las etapas no vienen con porcentaje
    this.stagesByModule.forEach((stage) => {

      stage["percentage"] = 0; //asignar a todas las etapas el atributo de porcentaje, inicializado en 0
    })


    //Obtener progreso
    this.triviaService.getProgress(this.user._id)
    .subscribe( resp => {

      console.log("respuesta getProgress()", resp);
      
      this.triviaProgress = resp['progress']

    },
    (error) => console.error(error));


    
  }

    //se actualiza el nivel para desbloquear etapas correspondientes
    ngDoCheck(): void{

      this.accessStage = this.extractCurrentLevel(this.stagesByModule);
  
      //actualizar porcentaje de etapas si es que existe el arreglo de progreso
      this.stagesByModule.forEach((stage) => {
  
        let saved;  //elemento del arreglo de progreso
  
        if(this.triviaProgress){
          saved = this.triviaProgress.find(estudio => estudio.study._id == stage.externalId)
        }
  
        if(saved){
          stage.percentage = saved.percentage * 100;
        }
      })
    }

  //función para obtener el valor de etapas accesibles según su step.
  extractCurrentLevel(stages: Stage[]) :number{
    let niveles: number[] = [];

    //extraer el valor de step de los niveles que no esten completados
    stages.forEach((etapa) => {
      //if no completado
      if(etapa.percentage < 100){
        niveles.push(etapa.step);
      }
    });
    //obtener el valor minimo y guardarlo en accessStage
    return Math.min.apply(null, niveles);

  }

  redirectToStage(stage){
    window.location.href = this.goToStage(stage);
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
