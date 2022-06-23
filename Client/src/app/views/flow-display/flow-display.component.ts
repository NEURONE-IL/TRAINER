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
import { HistoryService } from 'src/app/services/admin/history.service';
import { MatTable } from '@angular/material/table';


export function notExistingColl(collaborators): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(collaborators != null){
      let notExist: boolean = true;

      collaborators.filter( coll => {
        if(coll.user.email === control.value){
          notExist = false
        }
      })
      return notExist ? null : { 'notExistingColl': true };
    }
    
  };
}

export function notThisUser(user): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(user != null){
      control.markAsTouched();
      const isValid = user.email !== control.value;
      return isValid ? null : { 'notThisUser': true };
    }
    
  };
}


@Component({
  selector: 'app-flow-display',
  templateUrl: './flow-display.component.html',
  styleUrls: ['./flow-display.component.css'],
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
  testModules: any;

  collaboratorsExist: boolean = false;
  wasClone: boolean = false;
  cloneHistory: any[];
  user: any;
  userOwner: boolean = true;
  editMinutes: number = 3;

  columnsToDisplayCollaborators = ['icon','fullname', 'email', 'invitation','actions'];
  columnsToDisplayCollaboratorsNotOwner = ['icon','fullname', 'email','invitation'];
  columnsToDisplayCloneHistory = ['fullname', 'email', 'date','hour'];
  emailFormControl: FormControl;


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
              private triviaService: ApiTriviaService,
              private historyService: HistoryService
              ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.createStage = false;

    this.flowService.getFlow(this.route.snapshot.paramMap.get('flow_id')).subscribe(
      response => {
        this.flow = response['flow'];
        console.log(this.flow)
        this.registerLink = this.authService.getRegisterLink(this.flow._id);

        this.emailFormControl = new FormControl('', [Validators.email,notThisUser(this.user),notExistingColl(this.flow.collaborators)]);
        if (this.flow.collaborators.length>0)
          this.collaboratorsExist = true;

        if(!(this.user._id == this.flow.user._id))
          this.userOwner = false;
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
    this.historyService.getHistoryByFlowByType(this.route.snapshot.paramMap.get('flow_id'),'clone').subscribe(
      response => {
        this.cloneHistory = response['histories'];

        if (this.cloneHistory.length>0){
          this.cloneHistory.forEach( history => {

            let d = new Date(history.createdAt);
            let date = (d.getDate() < 10? '0':'') + d.getDate() + (d.getMonth() < 10 ? '/0' : '/') + (d.getMonth() + 1) + '/' + d.getFullYear();          
            let hour = (d.getHours() < 10 ? '0' : '') +d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '')+ d.getMinutes();
            history.createdAt = date + ' ' + hour;
          })
          this.wasClone = true;

        }
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.NOT_LOADED_ERROR"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );

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
    this.flowService.getFlow(this.flow._id).subscribe( 
      response =>{
        const dialogRef = this.matDialog.open(FlowUpdateComponent, {
          width: '60%',
          data: {flow: response.flow, userOwner:this.userOwner}
        }).afterClosed()
        .subscribe(() => this.ngOnInit());
      }, err => {
        console.log(err);
        this.toastr.error('Ha ocurrido un error al cargar la información del flujo', "Error",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    )
    
  }

  showStageUpdateDialog(stage: Stage): void {
    this.stageService.getStage(stage._id).subscribe( response => {

      const dialogRef = this.matDialog.open(StageUpdateComponent, {
        width: '60%',
        data: {stage: response['stage'], owner:this.flow.user}
      }).afterClosed()
      .subscribe(() => this.ngOnInit());
    }, err => {
      console.log(err);
      this.toastr.error('Ha ocurrido un error al cargar la información de la etapa', "Error",{
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
    })
    
  }

  showModuleUpdateDialog(module1: Module): void {
    this.moduleService.getModule(module1._id).subscribe( 
      response =>{
        const dialogRef = this.matDialog.open(ModuleUpdateComponent, {
          width: '60%',
          data: response.module
        }).afterClosed()
        .subscribe(() => this.ngOnInit());
      }, err =>{
        console.log(err);
        this.toastr.error('Ha ocurrido un error al cargar la información del módulo', "Error",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      })
    
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
    data.flow = this.flow;
    modal.afterClosed().subscribe(result => {
      this.reloadStages();
    });
  }

  //Valentina
  confirmAddCollaborator(){
    confirm('¿Seguro que desea agregar al colaborador?') && this.verifyCollaborator();
  }
  confirmRemoveCollaborator(collaborator){
    confirm('¿Seguro que desea eliminar al colaborador?') && this.deleteCollaborator(collaborator);
  }
  deleteCollaborator(collaborator){
    var newCollaboratorList = this.flow.collaborators.filter(
                              coll => coll.user.email !== collaborator.user.email);
    this.editCollaborator(newCollaboratorList,"Se ha eliminado correctamente el colaborador al estudio","El colaborador no ha podido ser eliminado");
  }
  addCollaborator(user: any){
    let newCollaboratorList = this.flow.collaborators.slice();
    newCollaboratorList.push({user: user, invitation: 'Pendiente'});
    this.editCollaborator(newCollaboratorList,"Se ha añadido correctamente el colaborador al estudio","El colaborador no ha podido ser añadido");
    this.emailFormControl.setValue('');
  }

  @ViewChild(MatTable) table: MatTable<any>;
  editCollaborator(collaboratorList, msg1, msg2){
    this.flowService.editCollaboratorsFlow(this.flow._id, collaboratorList).subscribe(
      response => {
        this.toastr.success(msg1, "Éxito",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.flow.collaborators = response.flow.collaborators;

        this.emailFormControl.setValidators([Validators.email,notThisUser(this.user),notExistingColl(this.flow.collaborators)]);
        this.emailFormControl.updateValueAndValidity();
        
        if(this.flow.collaborators.length > 0){
          this.collaboratorsExist = true;
          this.table.renderRows();
        }
        else
          this.collaboratorsExist = false;
        
      },
      err => {
        this.toastr.error(msg2, "Error",{
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );

  }
  verifyCollaborator(){
    if(this.emailFormControl.value === '' || this.emailFormControl.status === 'INVALID'){
      return
    }
    let collaborator: any;
    this.authService.getUserbyEmail(this.emailFormControl.value).subscribe(
      response => {
        collaborator = response['user']
        this.addCollaborator(collaborator);

      },
      (error) => {
          if(error === 'EMAIL_NOT_FOUND'){
            this.toastr.error("No se encuentra el correo ingresado", "Usuario Inexistente", {
              timeOut: 5000,
              positionClass: 'toast-top-center'});
              return
            }

            if(error === 'ROLE_INCORRECT'){
            this.toastr.error("El usuario ingresado no cuenta con permisos de colaborador", "Usuario Incorrecto", {
              timeOut: 5000,
              positionClass: 'toast-top-center'});
              return
            }

            if(error === 'USER_NOT_CONFIRMED'){
            this.toastr.error("El usuario ingresado no ha terminado su proceso de registro", "Usuario no confirmado", {
              timeOut: 5000,
              positionClass: 'toast-top-center'});
              return
            }
      }
    );
  }

  confirmCollaborationLeft(){
    confirm('Seguro que desea dejar de ser colaborador del estudio: '+this.flow.name) && this.collaborationLeft();
  }
  collaborationLeft(){
    let collaborators = this.flow.collaborators.slice();
    let index = collaborators.findIndex(coll => coll.user._id === this.user._id)
    collaborators.splice(index,1);
    console.log(collaborators)
    this.editCollaborator(collaborators,"Ha dejado de ser colaborador del estudio: "+this.flow.name,"No se ha podido realizar la operación, intente más tarde");
    this.router.navigate(['/admin_panel']);

  }

}
