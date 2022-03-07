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

  @Input() modulo: Module;
  @Input() sorted: boolean;

  @Output() onModulosActualizados: EventEmitter<number> = new EventEmitter();
  @Output() onEtapasActualizadas: EventEmitter<number> = new EventEmitter();

  stagesByModule  : Stage[] = [];
  accessStage     : number = 1;
  user            : User;
  triviaProgress  : StudyProgress[] = [];
  totalProgress   : any[] = [];

  //TODO
  //videoProgress : VideoProgress[] = [];
  //videoquizprogress : VideoQuizProgress = [];
  //adventureprogress : AdventureProgress = [];

  // TIMER SECTION START
  // tiempo: number = 100;

  // minutos: string | number = Math.floor(this.tiempo / 60);
  // segundos: string | number = Math.floor(this.tiempo % 60);

  // minutosDisplay = (this.minutos < 10) ? '0' + this.minutos : this.minutos;
  // segundosDisplay = (this.segundos < 10) ? '0' + this.segundos : this.segundos;

  // activo: boolean = false;
  // miObservable = interval(1000)
  //   .subscribe( x => {
  //     this.tiempo -= 1;
  //     this.minutos = Math.floor(this.tiempo / 60);
  //     this.segundos = Math.floor(this.tiempo % 60);
  //     this.minutosDisplay = (this.minutos < 10) ? '0' + this.minutos : this.minutos;
  //     this.segundosDisplay = (this.segundos < 10) ? '0' + this.segundos : this.segundos;
  //   });

  // timer = new Promise( (resolve, reject) =>{
  //   setTimeout(() => {
  //     resolve( this.activo=true );
  //   }, this.tiempo*1000)
  // });

  //TIMER SECTION END

  constructor(  private cdRef: ChangeDetectorRef,
                private authService: AuthService,
                private videoModuleService: QuizService,
                private triviaService: ApiTriviaService,
                private apiSGService: ApiSGService,
                private trainerUserUIService: TrainerUserUIService) { }

  ngOnInit(): void {

    this.user = this.authService.getUser();

    // //TODO borrar esta prueba con observable
    // this.trainerUserUIService.myObservable.subscribe(this.trainerUserUIService.myObserver);

    // this.trainerUserUIService.getTotalProgress(this.user)
    //       .subscribe(x => {
    //         this.totalProgress = x;
    //         console.log("la respuesta del progreso total es: ", x);

    //         console.log("el progreso total es:", this.totalProgress);

    //       });
    // //hasta aqui

    if(this.sorted){

      this.stagesByModule = this.modulo.stages.sort((n1,n2) => {
        return n1.step - n2.step;
      });

      this.accessStage = this.extractCurrentLevel(this.stagesByModule);

    }

    else{
      this.stagesByModule = this.modulo.stages
    }

    console.log("etapas de ", this.modulo.name,  this.stagesByModule);


    //las etapas no vienen con porcentaje
    this.stagesByModule.forEach((stage) => {

      stage["percentage"] = 0; //asignar a todas las etapas el atributo de porcentaje, inicializado en 0
    })

    //Obtener progreso
    //this.trainerUserUIService.getProgress(this.user._id)
    this.triviaService.getProgress(this.user._id)
    .subscribe( resp => {

      this.triviaProgress = resp['progress']

      //actualizar porcentaje de etapas si es que existe el arreglo de progreso
      this.stagesByModule.forEach((stage) => {

        let saved;  //elemento del arreglo de progreso

        if(this.triviaProgress){
          saved = this.triviaProgress.find(estudio => estudio.study._id == stage.externalId)
        }

        if(saved){
          stage.percentage = saved.percentage * 100;
        }

        if(stage.percentage == 100){
          //suma 1 al total de etapas completadas en localstorage
          this.trainerUserUIService.setEtapasCompletadas();
        }

      });

      //Si todas las etapas de un modulo estan completadas, emite el valor de 1 para mostrar en el perfil de usuario
      if(this.stagesByModule.every(etapa => etapa.percentage == 100)){
        console.log("todas las etapas completadas en ", this.modulo.name, " actualizando localstorage");

        //funcion que suma 1 a modulos completados
        this.trainerUserUIService.setModulosCompletados();
      }

    },
    (error) => console.error(error));

    // TODO: cambiar a esta funcion cuando la obtencion de progresos de los otros ambientes esten listos
    // probablemente se deben realizar cambios porque resp será un arreglo de arreglos en lugar de un arreglo simple
    // this.trainerUserUIService.getTotalProgress(this.user)
    //   .subscribe( resp => {

    //     this.totalProgress = resp;

    //     //actualizar porcentaje de etapas si es que existe el arreglo de progreso
    //     this.stagesByModule.forEach((stage) => {

    //       let saved;  //elemento del arreglo de progreso

    //       // revisando progreso de trivia, repetir para adventure, video y videoquiz
    //       if(this.totalProgress[0]['progress']){
    //         saved = this.totalProgress[0]['progress'].find(estudio => estudio.study._id == stage.externalId)
    //       }

    //       if(saved){
    //         stage.percentage = saved.percentage * 100;
    //       }

    //       if(stage.percentage == 100){
    //         //suma 1 al total de etapas completadas en localstorage
    //         this.trainerUserUIService.setEtapasCompletadas();
    //       }

    //     });

    //     //Si todas las etapas de un modulo estan completadas, emite el valor de 1 para mostrar en el perfil de usuario
    //     if(this.stagesByModule.every(etapa => etapa.percentage == 100)){
    //       console.log("todas las etapas completadas en ", this.modulo.name, " actualizando localstorage");

    //       //funcion que suma 1 a modulos completados
    //       this.trainerUserUIService.setModulosCompletados();
    //     }

    //     },
    //     (error) => console.error(error));
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

  redirectToStage(stage){
    localStorage.setItem('stageId', stage._id);
    window.location.href = this.getStageLink(stage);
  }

  getStageLink(stage){
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
