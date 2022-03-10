import { Component, OnInit } from '@angular/core';
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


@Component({
  selector: 'app-flow-display',
  templateUrl: './flow-display.component.html',
  styleUrls: ['./flow-display.component.css']
})
export class FlowDisplayComponent implements OnInit {
  flow: Flow;
  stages: Stage[] = [];
  sortedStages: Stage[] = [];
  triviaProgress: TriviaStudy[] = [];
  createStage: boolean;
  modules: any;
  registerLink = '';
  dummyUser: any;
  resetingUser = false;
  mostrarFlujos: boolean = true;
  url = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private stageService: StageService,
              private flowService: FlowService,
              private moduleService: ModuleService,
              private toastr: ToastrService,
              private authService: AuthService,
              private translate: TranslateService,
              private apiSGService: ApiSGService,
              private videoModuleService: QuizService,
              public matDialog: MatDialog,
              private triviaService: ApiTriviaService
              ) { }

  ngOnInit(): void {
    this.createStage = false;

    this.flowService.getFlow(this.route.snapshot.paramMap.get('flow_id')).subscribe(
      response => {
        this.flow = response['flow'];
        this.registerLink = this.authService.getRegisterLink(this.flow._id);
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
        console.log(this.sortedStages)
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.reloadModules();
  }

  resetFlowDummy(){
    this.resetingUser = true;
    this.flowService.resetFlowDummy(this.route.snapshot.paramMap.get('flow_id')).subscribe(response => {
      this.dummyUser = response['user'];
      this.resetingUser = false;
    } , err => {
      this.resetingUser = false;
      }
    );
  }

  getTestUser(){
    this.flowService.getFlowDummy(this.route.snapshot.paramMap.get('flow_id')).subscribe(response => {
      this.dummyUser = response['user'];
      this.getProgress();
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

  confirmFlowDelete(id: string){
    confirm(this.translate.instant("ADMIN.FLOWS.DELETE_CONFIRMATION")) && this.deleteFlow(id);
  }

  deleteFlow(id: string){
    this.flowService.deleteFlow(id)
      .subscribe(flow => {
        this.toastr.success(this.translate.instant("FLOW.TOAST.SUCCESS_MESSAGE_DELETE"), this.translate.instant("FLOW.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['admin_panel']);
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.ERROR_MESSAGE_DELETE"), this.translate.instant("FLOW.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  confirmStageDelete(id: string){
    confirm(this.translate.instant("ADMIN.STAGES.DELETE_CONFIRMATION")) && this.deleteStage(id);
  }

  deleteStage(id: string){
    this.stageService.deleteStage(id)
      .subscribe(stage => {
        this.stageService.getStagesByFlowSortedByStep(this.route.snapshot.paramMap.get('flow_id'))
          .subscribe(response => this.sortedStages = response['stages']);
        this.toastr.success(this.translate.instant("STAGE.TOAST.SUCCESS_MESSAGE_DELETE"), this.translate.instant("STAGE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      },
      err => {
        this.toastr.error(this.translate.instant("STAGE.TOAST.ERROR_MESSAGE_DELETE"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  confirmModuleDelete(id: string){
    confirm(this.translate.instant("ADMIN.MODULES.DELETE_CONFIRMATION")) && this.deleteModule(id);
  }

  deleteModule(id: string){
    this.moduleService.deleteModule(id)
      .subscribe(module => {
        this.reloadModules();
      },
      err => {
        this.toastr.error(this.translate.instant("STAGE.TOAST.ERROR_MESSAGE_DELETE"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  updateStage(id: string, updatedStage: string){
    this.stageService.putStage(id, updatedStage)
    .subscribe(stage => {
      this.stageService.getStagesByFlowSortedByStep(this.route.snapshot.paramMap.get('flow_id'))
        .subscribe(response => this.sortedStages = response['stages']);
        this.toastr.success(this.translate.instant("STAGE.TOAST.SUCCESS_MESSAGE_UPDATE") + stage['stage'].title, this.translate.instant("STAGE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      },
      err => {
        this.toastr.error(this.translate.instant("STAGE.TOAST.ERROR_MESSAGE_UPDATE"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  showFlowUpdateDialog(): void {
    const dialogRef = this.matDialog.open(FlowUpdateComponent, {
      width: '60%',
      data: this.flow
    }).afterClosed()
    .subscribe(() => this.ngOnInit());
  }

  showStageUpdateDialog(stage: Stage): void {
    const dialogRef = this.matDialog.open(StageUpdateComponent, {
      width: '60%',
      data: stage
    }).afterClosed()
    .subscribe(() => this.ngOnInit());
  }

  showModuleUpdateDialog(module1: Module): void {
    const dialogRef = this.matDialog.open(ModuleUpdateComponent, {
      width: '60%',
      data: module1
    }).afterClosed()
    .subscribe(() => this.ngOnInit());
  }

  getClass(active, type){

    if(type === 'Trivia'){
      return 'Trivia';
    }
    else if(type === 'SG'){
      return 'SG';
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
    if (stage.type === 'SG'){
      return this.apiSGService.getAdventureLink(stage.externalId);
    }
  }

  getCover(type: string): string{
    switch (type) {
      case 'Trivia':
        return '../../../assets/stage-images/00Trivia.jpg';
      case 'SG':
        return '../../../assets/stage-images/01Adventure.jpg';
      case 'Video':
        return '../../../assets/stage-images/02Video.jpg';
      case 'Video + Quiz':
        return '../../../assets/stage-images/03VideoQuiz.jpg';
      default:
        return '../../../assets/flow-images/Flow00_Ext.jpg';
    }
  }

  openModuleCreation(): void {
    const modal = this.matDialog.open(ModuleCreationComponent, {
      width: '100%'
    });
    const data = modal.componentInstance;
    data.flow = this.flow._id;
    modal.afterClosed().subscribe(result => {
      this.reloadModules();
    });
  }

  openStageCreation(): void {
    const modal = this.matDialog.open(StageCreationComponent, {
      width: '100%'
    });
    const data = modal.componentInstance;
    data.flow = this.flow._id;
    modal.afterClosed().subscribe(result => {
      this.reloadStages();
    });
  }

}
