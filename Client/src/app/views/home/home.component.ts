import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ApiTriviaService } from '../../services/apiTrivia/apiTrivia.service';
import { ApiSGService } from '../../services/apiSG/apiSG.service';
import { StudyProgress, StageService } from '../../services/trainer/stage.service';
import { Flow, FlowService } from '../../services/trainer/flow.service';
import { Module } from 'src/app/services/trainer/module.service';
import { KmTrackerService } from 'src/app/services/logger/km-tracker.service';
import { ActionsTrackerService } from 'src/app/services/logger/actions-tracker.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              public authService: AuthService,
              private router: Router,
              private toastr: ToastrService,
              private apiSGService: ApiSGService,
              private flowService: FlowService,
              private stageService: StageService,
              private translate: TranslateService,
              private triviaService: ApiTriviaService,
              private actionsTrackerService: ActionsTrackerService,
              private kmTrackerService: KmTrackerService) { }

  flow: Flow;
  flowId: string;
//  triviaProgress: TriviaStudy[] = [];
//  flowId = null;                        //usuario sin flujo asignado
//  flowId = "6154b334b40ac2106a87d2f0";  //flujo libre de prueba
//  flowId = "618ec5e213fb7313d7ca77d7"; //flujo ordenado de prueba
  apikey = this.triviaService.apiKey;
  stages;
  progress: any;
  user: any;
  currentView: string;

  ngOnInit(): void {
//    this.getActualUserInformation();
//    this.getFlowStagesInformation();
    localStorage.removeItem('stageId');
    this.actionsTrackerService.start();
    this.kmTrackerService.start();
//    this.getAdvance();

      //id del flujo esta dentro del usuario, pero para obtener el usuario necesito el id del flujo
/*      this.flowService.getFlowTestUser("618ec5e213fb7313d7ca77d7").subscribe(response => {
        this.user = response['user'];
        console.log("datos del usuario: ", this.user);
        this.flowId = this.user.flow;
        console.log("id del flujo: ", this.flowId);
        this.getFlowInformation(this.flowId);              //obtener datos del flujo
        this.getProgress();                               //arreglo del progreso, debe pasar al modulo y luego a etapas
      });*/
      this.user = this.authService.getUser();             //obtener datos del usuario de localstorage
      console.log("datos del usuario: ", this.user);
      this.flowId = this.user.flow;
      console.log("id del flujo: ", this.flowId);
      this.getFlowInformation(this.flowId);              //obtener datos del flujo
//      this.getAdvance();
      this.getProgress();                               //arreglo del progreso, debe pasar al modulo y luego a etapas
//      console.log("datos del usuario: ", this.user);
  }

  ngOnDestroy(): void {
    this.kmTrackerService.stop();
    this.actionsTrackerService.stop();
  }  

  getFlowStagesInformation(){
    this.stageService.getStagesByFlow(this.flowId).subscribe((res: any) => {
      this.stages = res.stages;
    } );
  }
  getFlowInformation(flowId: string){
    this.flowService.getFlow(flowId).subscribe((res: any) => {
      this.flow = res.flow;
      
    });
  }

  getProgress(){
    //    if(this.authService.isAdmin()){
          this.triviaService.getProgress(this.user._id).subscribe(response => {
              
              this.progress = response['progress'];
            
//            console.log(this.progress, 'progress');
//            console.log('testUser');
          },
          error => {
            console.error(error);
          });
    //    }else{
    //      this.triviaService.getProgress(this.authService.getUser()._id).subscribe(response => {
    //        this.triviaProgress = response['progress'];
    //        console.log(this.triviaProgress, 'progress');
    //        console.log('realUser');
    //      });      
    //    }
      }


  getActualUserInformation(){
    this.user = this.authService.getActualUserInformation();
    this.flowId = this.authService.getActualUserInformation().flow;
  }
  goToStage(stage){
    console.log(stage);
    if (stage.type === 'Video'){

      this.router.navigate(['/videoModule']);
    }
    if (stage.type === 'Trivia'){

      window.location.href = this.triviaService.getStudyLink(stage.link, this.user);
      console.log(this.triviaService.getStudyLink(stage.link, this.user));
    }
    if (stage.type === 'SG'){

      window.location.href = this.apiSGService.getAdventureLink(stage.link);
      return;
    }
  }
  getApiKey(){
    this.triviaService.getApiKey().subscribe((res) => {
      console.log(res);
    });
  }

  getApiStudies(){
    this.triviaService.getStudies().subscribe((res) => {
      console.log(res);
    });
  }

  getAdvance(){
    this.triviaService.getProgress(this.user._id).subscribe((response) => {
      console.log(response, 'progress');
      this.progress = response['progress'];
      this.progress.forEach(element => {
        console.log('elementAdv', element)
        this.stageService.updateProgress(this.user._id, this.flowId, element.study._id, element.percentage).subscribe(response => {
          this.stages = response['stages'];
//          console.log(response, 'TRAINER UpdateProgress');
        });
      });
    });
  }


  getClass(type){
    if (type === 'Trivia'){
      return 'Trivia';
    }
    else if (type === 'SG'){
      return 'SG';
    }
    else if (type === 'Video'){
      return 'Video';
    }
    else if(type === 'Video + Quiz'){
      return 'VideoQuiz';
    } 
  }
}

