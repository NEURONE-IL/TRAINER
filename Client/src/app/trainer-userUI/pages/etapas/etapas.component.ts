import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiSGService } from 'src/app/services/apiSG/apiSG.service';
import { ApiTriviaService } from 'src/app/services/apiTrivia/apiTrivia.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { QuizService } from 'src/app/services/videoModule/quiz.service';
import { Stage, StudyProgress } from '../../interfaces/stage.interface';
import { User } from '../../interfaces/user.interface';
import { Module } from 'src/app/trainer-userUI/interfaces/module.interface';
import { TrainerUserUIService } from '../../services/trainer-user-ui.service';
// import { interval } from 'rxjs'; en caso de utilizar el cooldown de niveles
//importacion de interfaces de VideoProgress, VideoQuizProgress y AdventureProgress

@Component({
  selector: 'app-etapas',
  templateUrl: './etapas.component.html',
  styleUrls: ['./etapas.component.css']
})
export class EtapasComponent implements OnInit{

  @Input() modulo   : Module;
  @Input() sorted   : boolean;
  @Input() moduleID : string;

  @Output() moduleIDChange: EventEmitter<string> = new EventEmitter();

  stagesByModule  : Stage[] = [];
  accessStage     : number = 1;
  user            : User;
  triviaProgress  : StudyProgress[] = [];
  totalProgress   : any[] = [];

  //TODO
  //videoProgress : VideoProgress[] = [];
  //videoquizprogress : VideoQuizProgress = [];
  //adventureprogress : AdventureProgress = [];

  constructor(  private cdRef: ChangeDetectorRef,
                private authService: AuthService,
                // private videoModuleService: QuizService,
                // private triviaService: ApiTriviaService,
                // private apiSGService: ApiSGService,
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

    //las etapas no vienen con porcentaje
    this.stagesByModule.forEach((stage) => {

      stage["percentage"] = 0; //asignar a todas las etapas el atributo de porcentaje, inicializado en 0
    })

    
    // TODO: cambiar a esta funcion cuando la obtencion de progresos de los otros ambientes esten listos
    this.trainerUserUIService.getTotalProgress(this.user)
      .subscribe( resp => {
        //resp => [{progresoTrivia}, {progresoSG}, {...} , ...]
        console.log("totalProgress: ", resp);
        
        this.totalProgress = resp;

        //actualizar porcentaje de etapas si es que existe el arreglo de progreso
        this.stagesByModule.forEach((stage) => {

          let saved;  //elemento del arreglo de progreso

          // revisando progreso de trivia, repetir para adventure, video y videoquiz
          if(stage.type == "Trivia"){
            
            saved = this.totalProgress[0]['progress'].find(estudio => estudio.study._id == stage.externalId)
          }
  
          else if(stage.type == "SG"){
            
            saved = this.totalProgress[1]['progress'].find(estudio => estudio.adventure._id == stage.externalId)
          }
          
          if(saved){
            stage.percentage = saved.percentage * 100;
            saved = false;
          }
          if(stage.percentage == 100){
            //suma 1 al total de etapas completadas en localstorage
            this.trainerUserUIService.setEtapasCompletadas();
          }

        });

        //Si todas las etapas de un modulo estan completadas, emite el valor de 1 para mostrar en el perfil de usuario
        if(this.stagesByModule.every(etapa => etapa.percentage == 100)){

          //funcion que suma 1 a modulos completados
          this.trainerUserUIService.setModulosCompletados();
        }
        //en caso contrario se emite el id del modulo incompleto ...
        else{
          if(!this.trainerUserUIService.indiceEncontrado){
            console.log("modulo incompleto: ", this.modulo._id);
            
            this.moduleIDChange.emit(this.modulo._id);
            this.trainerUserUIService.indiceEncontrado = true;
          }

          //... y se guarda el link de la etapa incompleta para el boton continuar
          if(!this.trainerUserUIService.nextStage){
            let etapaIncompleta = this.stagesByModule.find(etapa => etapa.percentage < 100);
            
            this.trainerUserUIService.nextStage = etapaIncompleta;
          }
        }
        
      },
      (error) => console.error(error));
  }

  //se actualiza el nivel para desbloquear etapas correspondientes
  ngDoCheck(): void{
    this.accessStage = this.extractCurrentLevel(this.stagesByModule);

  }

  //para evitar error "Expression has changed after it was checked"
  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();

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

  // redirectToStage(stage){
  //   localStorage.setItem('stageId', stage._id);
  //   window.location.href = this.getStageLink(stage);
  // }

  // getStageLink(stage){
  //   /*
  //   console.log(stage);
  //   //Dispatch pageenter event
  //   var evt = new CustomEvent('stageenter', { detail: 'Enter to "' + stage._id + '" stage' });
  //   window.dispatchEvent(evt);
  //   //End dispatch pageenter event
  //   */
  //   if (stage.type === 'Video'){
  //     return this.videoModuleService.getVideoLink(stage.externalId);
  //   }
  //   if (stage.type === 'Video + Quiz'){
  //     return this.videoModuleService.getVideoQuizLink(stage.externalId);
  //   }
  //   if (stage.type === 'Trivia'){
  //     return this.triviaService.getStudyLink(stage.externalId, this.user);
  //   }
  //   if (stage.type === 'Adventure'){
  //     return this.apiSGService.getAdventureLink(stage.externalId);
  //   }
  // }

  goToStage(stage){
    this.trainerUserUIService.redirectToStage(stage, this.user);
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

    else if(tipo == "Adventure"){
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

  // this.trainerUserUIService.getTotalProgress(this.user)
  //   .subscribe(resp => {
  //     let flattenedProgress = [];
  //     flattenedProgress.push(resp[0]['progress']);
  //     flattenedProgress.push(resp[1]['progress']);
  //     console.log("getTotalProgress(): ", [].concat.apply([], flattenedProgress));
  //   } )

  //Obtener progreso
  // this.trainerUserUIService.getProgress(this.user._id)
  //  this.triviaService.getProgress(this.user._id)
  // .subscribe( resp => {

  //   this.triviaProgress = resp['progress']

  //   //actualizar porcentaje de etapas si es que existe el arreglo de progreso
  //   this.stagesByModule.forEach((stage) => {

  //     let saved;  //elemento del arreglo de progreso

  //     if(this.triviaProgress){
  //       saved = this.triviaProgress.find(estudio => estudio.study._id == stage.externalId)
  //     }

  //     if(saved){
  //       stage.percentage = saved.percentage * 100;
  //     }

  //     if(stage.percentage == 100){
  //       //suma 1 al total de etapas completadas en localstorage
  //       this.trainerUserUIService.setEtapasCompletadas();
  //     }

      
  //   });
    
  //   //Si todas las etapas de un modulo estan completadas, emite el valor de 1 para mostrar en el perfil de usuario
  //   if(this.stagesByModule.every(etapa => etapa.percentage == 100)){
      
  //     //funcion que suma 1 a modulos completados
  //     this.trainerUserUIService.setModulosCompletados();
      
  //   }
  //   //en caso contrario se emite el id del modulo incompleto
  //   else{
  //     if(!this.trainerUserUIService.indiceEncontrado){
  //       this.moduleIDChange.emit(this.modulo._id);
  //       this.trainerUserUIService.indiceEncontrado = true;
  //     }
  //   }

  // },
  // (error) => console.error(error));