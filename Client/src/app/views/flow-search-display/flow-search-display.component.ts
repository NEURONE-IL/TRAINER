import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Stage, StageService } from '../../services/trainer/stage.service';
import { Flow, FlowService } from '../../services/trainer/flow.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiTriviaService, TriviaStudy } from '../../services/apiTrivia/apiTrivia.service';
import { AuthService } from '../../services/auth/auth.service';
import { ApiSGService } from '../../services/apiSG/apiSG.service';
import { QuizService } from '../../services/videoModule/quiz.service';
import { Module, ModuleService } from 'src/app/services/trainer/module.service';
import { FlowUpdateComponent } from 'src/app/views/flow-update/flow-update.component';
import { StageUpdateComponent } from 'src/app/views/stage-update/stage-update.component';

import { ModuleCreationComponent } from '../module-creation/module-creation.component';
import { StageCreationComponent } from '../stage-creation/stage-creation.component';
import { ModuleUpdateComponent } from '../module-update/module-update.component';
import { TrainerUserUIService } from '../../trainer-userUI/services/trainer-user-ui.service';
import { FormControl, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-flow-search-display',
  templateUrl: './flow-search-display.component.html',
  styleUrls: ['./flow-search-display.component.css']
})
export class FlowSearchDisplayComponent implements OnInit {

  flow: Flow;
  stages: Stage[] = [];
  sortedStages: Stage[] = [];
  triviaProgress: TriviaStudy[] = [];
  modules: any;
  dummyUser: any;
  resetingUser = false;
  mostrarFlujos: boolean = true;
  url = '';
  testModules: any;

  collaboratorsExist: boolean = false;
  user: any;

  columnsToDisplayCollaborators = ['icon','fullname', 'email'];

  loadingClone: boolean = false;
  notActualCollaborator: boolean = true;
  collabSended: boolean = false;
  filterCollaborators: any[];
  existingInvitation: boolean = false;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private stageService: StageService,
              private flowService: FlowService,
              private moduleService: ModuleService,
              private trainerUserUIService: TrainerUserUIService,
              private toastr: ToastrService,
              private authService: AuthService,
              private translate: TranslateService,
              private apiSGService: ApiSGService,
              private videoModuleService: QuizService,
              public matDialog: MatDialog,
              private triviaService: ApiTriviaService
              ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.flowService.getFlow(this.route.snapshot.paramMap.get('flow_id')).subscribe(
      response => {
        this.flow = response['flow'];
        console.log(this.flow)

        if (this.flow.collaborators.length>0){
          this.collaboratorsExist = true
          this.filterCollaborators = this.flow.collaborators.filter(coll => coll.invitation === 'Aceptada')
          this.notActualCollaborator = !this.filterCollaborators.some(coll => coll.user._id === this.user._id)
        }
        else{
          this.collaboratorsExist = false;
          this.notActualCollaborator = true;
        }
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.NOT_LOADED_ERROR"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );

    this.getTestUser();
/*
    this.stageService.getStagesByFlow(this.route.snapshot.paramMap.get('flow_id'))
      .subscribe(response => {
        this.stages = response['stages'];
    });
*/
    this.stageService.getStagesByFlowSortedByStep(this.route.snapshot.paramMap.get('flow_id'))
      .subscribe(response => {
        this.sortedStages = response['stages'];
        //console.log(this.sortedStages)
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.reloadModules();
  }

  //arreglo parche
  // el flujo de prueba para el usuario solo se carga si se ha presionado el boton de reset user
  ngOnDestroy(): void {
    this.resetTestUser();
  }

  resetFlowTestUser(){
    this.resetingUser = true;
    this.flowService.resetFlowTestUser(this.route.snapshot.paramMap.get('flow_id')).subscribe(response => {
      this.dummyUser = response['user'];
      this.resetingUser = false;
    } , err => {
      this.resetingUser = false;
      }
    );
  }

  getTestUser(){
    this.flowService.getFlowTestUser(this.route.snapshot.paramMap.get('flow_id')).subscribe(response => {
      this.dummyUser = response['user'];
      // this.getProgress();
      this.getUserFlow(this.dummyUser._id)
    });
  }

  getUserFlow(userId){
    this.trainerUserUIService.getUserFlow(userId).subscribe( respUserFlow => {
      this.testModules = respUserFlow.userFlow.modules;
    });

  }

  getProgress(){
//    if(this.authService.isAdmin()){
      this.triviaService.getProgress(this.dummyUser._id).subscribe(response => {
        this.triviaProgress = response['progress'];
        console.log(this.triviaProgress, 'progress');
        console.log('testUser');
      });
//    }else{
//      this.triviaService.getProgress(this.authService.getUser()._id).subscribe(response => {
//        this.triviaProgress = response['progress'];
//        console.log(this.triviaProgress, 'progress');
//        console.log('realUser');
//      });
//    }
  }

  resetTestUser(){
    this.authService.resetTestUser(this.flow._id).subscribe(
      user => {
        this.triviaService.resetTriviaUser(user['_id']).subscribe(
          triviaUser => {
            console.log("Trivia user reseted");
          },
          err => {
            console.log(err);
          }
        )
        this.toastr.success(this.translate.instant("FLOW.TOAST.TEST_USER_RESET_SUCCESS"), this.translate.instant("FLOW.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.TEST_USER_RESET_ERROR"), this.translate.instant("FLOW.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    )
  }

  getClass(active, type){

    if(type === 'Trivia'){
      return 'Trivia';
    }
    else if(type === 'Adventure'){
      return 'Adventure';
    }
    else if(type === 'Video'){
      return 'Video';
    }
    else if(type === 'Video + Quiz'){
      return 'VideoQuiz';
    }
  }

  formatDate(date){
    return date.substr(0,10);
  }

  reloadStages(){
/*
    this.stageService.getStagesByFlow(this.route.snapshot.paramMap.get('flow_id'))
      .subscribe(response => {
        this.stages = response['stages'];
    });
*/
    this.stageService.getStagesByFlowSortedByStep(this.route.snapshot.paramMap.get('flow_id'))
      .subscribe(response => {
        this.sortedStages = response['stages'];
        console.log(this.sortedStages)
    });

  }

  reloadModules(){
    /*
        this.stageService.getStagesByFlow(this.route.snapshot.paramMap.get('flow_id'))
          .subscribe(response => {
            this.stages = response['stages'];
        });
    */
        this.moduleService.getModuleByFlow(this.route.snapshot.paramMap.get('flow_id'))
          .subscribe(response => {
            this.modules = response['modules'];
        });

      }

  getLinkToTriviaStudy(studyId){
    return this.triviaService.getStudyLink(studyId, this.dummyUser);
  }

  goToStage(stage){
    localStorage.setItem('stageId', stage._id);
    if (stage.type === 'Video'){
      return this.videoModuleService.getVideoLink(stage.externalId);
    }
    if (stage.type === 'Video + Quiz'){
      return this.videoModuleService.getVideoQuizLink(stage.externalId);
    }
    if (stage.type === 'Trivia'){
      return this.triviaService.getStudyLink(stage.externalId, this.dummyUser);
    }
    if (stage.type === 'Adventure'){
      return this.apiSGService.getAdventureLink(stage.externalId);
    }
  }

  getCover(type: string): string{
    switch (type) {
      case 'Trivia':
        return '../../../assets/stage-images/00Trivia.jpg';
      case 'Adventure':
        return '../../../assets/stage-images/01Adventure.jpg';
      case 'Video':
        return '../../../assets/stage-images/02Video.jpg';
      case 'Video + Quiz':
        return '../../../assets/stage-images/03VideoQuiz.jpg';
      default:
        return '../../../assets/flow-images/Flow00_Ext.jpg';
    }
  }

  //Valentina

  confirmCloneStudy(){
    confirm("¿Seguro/a que desea clonar este estudio?") /*&& this.cloneStudy();*/
  }
  confirmCollaborateRequest(): void {
    confirm("¿Seguro/a que desea solicitar colaborar en este estudio?") /*&& this.requestCollaboration()*/;
  }

}
