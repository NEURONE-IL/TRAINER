import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Stage, StageService } from '../../services/trainer/stage.service';
import { Flow, FlowService } from '../../services/trainer/flow.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiTriviaService } from "../../services/apiTrivia/apiTrivia.service";
import { AuthService } from '../../services/auth/auth.service';
import { ApiSGService } from '../../services/apiSG/apiSG.service';
import { QuizService } from '../../services/videoModule/quiz.service';
import { ModuleService } from 'src/app/services/trainer/module.service';

@Component({
  selector: 'app-flow-display',
  templateUrl: './flow-display.component.html',
  styleUrls: ['./flow-display.component.css']
})
export class FlowDisplayComponent implements OnInit {
  flow: Flow;
  stages: Stage[] = [];
  sortedStages: Stage[] = [];
  createStage: boolean;
  modules: any;
  registerLink = '';
  dummyUser: any;

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
    this.flowService.resetFlowDummy(this.route.snapshot.paramMap.get('flow_id')).subscribe(response => {
      this.dummyUser = response['user'];
    });
  }

  getTestUser(){
    this.flowService.getFlowDummy(this.route.snapshot.paramMap.get('flow_id')).subscribe(response => {
      this.dummyUser = response['user'];
    });
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
        this.toastr.success(this.translate.instant("STAGE.TOAST.SUCCESS_MESSAGE_UPDATE") + stage['stage'].question, this.translate.instant("STAGE.TOAST.SUCCESS"), {
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
    const dialogRef = this.matDialog.open(FlowUpdateDialogComponent, {
      width: '60%',
      data: this.flow
    }).afterClosed()
    .subscribe(() => this.ngOnInit());
  }

  showStageUpdateDialog(stage: Stage): void {
    const dialogRef = this.matDialog.open(StageUpdateDialogComponent, {
      width: '60%',
      data: stage
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
    return this.triviaService.getStudyLink(studyId);
  }

  goToStage(stage){
    if (stage.type === 'Video'){
      return this.videoModuleService.getModuleLink();
    }
    if (stage.type === 'Trivia'){
      return this.triviaService.getStudyLink(stage.externalId);
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
      default:
        return '../../../assets/flow-images/Flow00.jpg';
    }
  }
}

@Component({
  selector: 'app-flow-update-dialog',
  templateUrl: 'flow-update-dialog.component.html',
  styleUrls: ['./flow-update-dialog.component.css']
})
export class FlowUpdateDialogComponent implements OnInit{
  flowForm: FormGroup;
  loading: Boolean;
  file: File;

  constructor(@Inject(MAT_DIALOG_DATA)
    public flow: Flow,
    private formBuilder: FormBuilder,
    private flowService: FlowService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public matDialog: MatDialog) { }

  ngOnInit(): void {
    this.flowForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      domain: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      type: ['', [Validators.required]]
    });
    this.loading = false;
  }

  get flowFormControls(): any {
    return this.flowForm['controls'];
  }

  resetForm() {
    this.flowForm.reset();
  }

  updateFlow(flowId: string){
    this.loading = true;
    let flow = this.flowForm.value;
    let formData = new FormData();
    formData.append('name', flow.name);
    formData.append('description', flow.description);
    formData.append('domain', flow.domain);
    formData.append('type', flow.type);
    if(this.file){
      formData.append('file', this.file);
    }
    this.flowService.putFlow(flowId, formData).subscribe(
      flow => {
        this.toastr.success(this.translate.instant("FLOW.TOAST.SUCCESS_MESSAGE_UPDATE") + ': ' + flow['flow'].name, this.translate.instant("FLOW.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loading = false;
        this.matDialog.closeAll();
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.ERROR_MESSAGE_UPDATE"), this.translate.instant("FLOW.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }
}

@Component({
  selector: 'app-stage-update-dialog',
  templateUrl: 'stage-update-dialog.component.html',
  styleUrls: ['./stage-update-dialog.component.css']
})
export class StageUpdateDialogComponent implements OnInit{
  @Input() flow: string;
  stageForm: FormGroup;
  flows: Flow[];
  loading: Boolean;

  constructor(@Inject(MAT_DIALOG_DATA)
    public stage: Stage,
    private formBuilder: FormBuilder,
    private router: Router,
    private stageService: StageService,
    private flowService: FlowService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public matDialog: MatDialog) { }

  ngOnInit(): void {

    this.stageForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      step: ['', [Validators.required]],
      type: ['', [Validators.required]],
      link: ['', [Validators.required]]
    });

    this.flowService.getFlows().subscribe(
      response => {
        this.flows = response['flows'];
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );

    this.loading = false;
  }

  get stageFormControls(): any {
    return this.stageForm['controls'];
  }

  updateStage(stageId: string){
    this.loading = true;
    let stage = this.stageForm.value;
    stage.flow = this.stage.flow;
    this.stageService.putStage(stageId, stage).subscribe(
      stage => {
        this.toastr.success(this.translate.instant("STAGE.TOAST.SUCCESS_MESSAGE_UPDATE") + ': ' + stage['stage'].question, this.translate.instant("STAGE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loading = false;
        this.matDialog.closeAll();
      },
      err => {
        this.toastr.error(this.translate.instant("STAGE.TOAST.ERROR_MESSAGE_UPDATE"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
}

