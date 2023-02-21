import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Stage, StudyProgress } from '../../interfaces/stage.interface';
import { User } from '../../interfaces/user.interface';
import { TrainerUserUIService } from '../../services/trainer-user-ui.service';
import { QuizService } from '../../../services/videoModule/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { QuizComponent } from '../../../components/quiz/quiz.component';
// import { interval } from 'rxjs'; en caso de utilizar el cooldown de niveles

@Component({
  selector: 'app-etapas',
  templateUrl: './etapas.component.html',
  styleUrls: ['./etapas.component.css']
})
export class EtapasComponent implements OnInit{

 
  @Input() sorted   : boolean;
  @Input() flowId   : string;
  @Input() moduleId : string;
  @Input() user     : User;
  @Input() userFlowStages : any;

  // userInLocalStorage: any;

  stagesByModule  : Stage[] = [];
  triviaProgress  : StudyProgress[] = [];
  totalProgress   : any[] = [];

  constructor(  private cdRef: ChangeDetectorRef,
                private authService: AuthService,
                private quizService: QuizService,
                public matDialog: MatDialog,
                private trainerUserUIService: TrainerUserUIService) { }

  ngOnInit(): void {
    
    // this.userInLocalStorage = JSON.parse(localStorage.getItem('currentUser'));

    if(this.sorted){

      this.stagesByModule = this.userFlowStages.sort((n1,n2) => {
        return n1.stage.step - n2.stage.step;
      });

    }

    else{
      this.stagesByModule = this.userFlowStages;
    }

    console.log("stagesByModule: ", this.stagesByModule);
    
  }

  goToStage(stage){
    
    this.trainerUserUIService.updateLastStagePlayed(this.user._id, stage._id).subscribe();

    let objEvento = {
      user: this.user._id,
      flow: this.flowId,
      module: this.moduleId,
      stage: stage._id,
      eventDescription: "User has clicked stage " + stage._id
    }
    
    this.trainerUserUIService.saveEvent(objEvento).subscribe();
       
    console.log("STAGEEEE")
    console.log(stage)
    console.log(this.user)
   
    this.trainerUserUIService.redirectToStage(stage, this.user);
    
    //ABRIR MODULO DE VIDEO. 
    //TAMBIEN EDITE TRAINER.USER.UI.SERVICES.TS


  }

  //funcion para simular completado de etapa (para administrador)
  // addPercentage(objStage: any){
  //   if(objStage.percentage < 100){
  //     objStage.percentage = 100;
  //   }
  // }

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