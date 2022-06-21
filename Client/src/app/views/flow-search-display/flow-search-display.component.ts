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
import { ModuleService } from 'src/app/services/trainer/module.service';
import { TrainerUserUIService } from '../../trainer-userUI/services/trainer-user-ui.service';


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
    this.stageService.getStagesByFlowSortedByStep(this.route.snapshot.paramMap.get('flow_id'))
      .subscribe(response => {
        this.sortedStages = response['stages'];
        //console.log(this.sortedStages)
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.reloadModules();
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
    this.stageService.getStagesByFlowSortedByStep(this.route.snapshot.paramMap.get('flow_id'))
      .subscribe(response => {
        this.sortedStages = response['stages'];
        console.log(this.sortedStages)
    });

  }

  reloadModules(){
   
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
    confirm("¿Seguro/a que desea clonar este estudio?") && this.cloneFlow();
  }
  confirmCollaborateRequest(): void {
    confirm("¿Seguro/a que desea solicitar colaborar en este estudio?") /*&& this.requestCollaboration()*/;
  }
  cloneFlow(){
    this.loadingClone = true;
    let user_id = this.user._id
    this.flowService.cloneFlow(this.flow._id,user_id).subscribe(
      response => {
        console.log(response)
       
        this.loadingClone = false;
        let link = '/admin_panel/flow/'+response.flow._id ;
        this.toastr.success("El flujo ha sido clonado exitosamente","Éxito",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate([link]);
        this.loadingClone = false;
      },
      err => {
        this.toastr.error("El flujo seleccionado no ha podido ser clonado", "Error en la clonación", {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loadingClone = false;
      }
    );
  }

}
