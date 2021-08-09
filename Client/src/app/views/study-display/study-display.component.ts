import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Stage, StageService } from '../../services/trainer/stage.service';
import { Study, StudyService } from '../../services/trainer/study.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApiTriviaService} from "../../services/apiTrivia/apiTrivia.service";

@Component({
  selector: 'app-study-display',
  templateUrl: './study-display.component.html',
  styleUrls: ['./study-display.component.css']
})
export class StudyDisplayComponent implements OnInit {
  study: Study;
  stages: Stage[] = [];
  sortedStages: Stage[] = [];
  createStage: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private stageService: StageService,
              private studyService: StudyService,
              private toastr: ToastrService,
              private translate: TranslateService,
              public matDialog: MatDialog,
              private triviaService: ApiTriviaService
              ) { }

  ngOnInit(): void {
    this.createStage = false;

    this.studyService.getStudy(this.route.snapshot.paramMap.get('study_id')).subscribe(
      response => {
        this.study = response['study'];
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_ERROR"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );

    this.stageService.getStagesByStudy(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => {
        this.stages = response['stages'];
    });

    this.stageService.getStagesByStudySortedByStep(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => {
        this.sortedStages = response['stages'];
        console.log(this.sortedStages, 'sorted');
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  confirmStudyDelete(id: string){
    confirm(this.translate.instant("ADMIN.STUDIES.DELETE_CONFIRMATION")) && this.deleteStudy(id);
  }

  deleteStudy(id: string){
    this.studyService.deleteStudy(id)
      .subscribe(study => {
        this.toastr.success(this.translate.instant("STUDY.TOAST.SUCCESS_MESSAGE_DELETE"), this.translate.instant("STUDY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['admin_panel']);
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.ERROR_MESSAGE_DELETE"), this.translate.instant("STUDY.TOAST.ERROR"), {
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
        this.stageService.getStagesByStudy(this.route.snapshot.paramMap.get('study_id'))
          .subscribe(response => this.stages = response['stages']);
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

  updateStage(id: string, updatedStage: string){
    this.stageService.putStage(id, updatedStage)
    .subscribe(stage => {
      this.stageService.getStagesByStudy(this.route.snapshot.paramMap.get('study_id'))
        .subscribe(response => this.stages = response['stages']);
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

  showStudyUpdateDialog(): void {
    const dialogRef = this.matDialog.open(StudyUpdateDialogComponent, {
      width: '60%',
      data: this.study
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

  getClass(type){
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
    this.stageService.getStagesByStudy(this.route.snapshot.paramMap.get('study_id'))
      .subscribe(response => {
        this.stages = response['stages'];
      });
  }

  getLinkToTriviaStudy(studyId){
    return this.triviaService.getStudyLink(studyId);
  }
}

@Component({
  selector: 'app-study-update-dialog',
  templateUrl: 'study-update-dialog.component.html',
  styleUrls: ['./study-update-dialog.component.css']
})
export class StudyUpdateDialogComponent implements OnInit{
  studyForm: FormGroup;
  loading: Boolean;
  file: File;

  constructor(@Inject(MAT_DIALOG_DATA)
    public study: Study,
    private formBuilder: FormBuilder,
    private studyService: StudyService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public matDialog: MatDialog) { }

  ngOnInit(): void {
    this.studyForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      domain: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      type: ['', [Validators.required]]
    });
    this.loading = false;
  }

  get studyFormControls(): any {
    return this.studyForm['controls'];
  }

  resetForm() {
    this.studyForm.reset();
  }

  updateStudy(studyId: string){
    this.loading = true;
    let study = this.studyForm.value;
    let formData = new FormData();
    formData.append('name', study.name);
    formData.append('description', study.description);
    formData.append('domain', study.domain);
    formData.append('type', study.type);
    if(this.file){
      formData.append('file', this.file);
    }
    this.studyService.putStudy(studyId, formData).subscribe(
      study => {
        this.toastr.success(this.translate.instant("STUDY.TOAST.SUCCESS_MESSAGE_UPDATE") + ': ' + study['study'].name, this.translate.instant("STUDY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loading = false;
        this.matDialog.closeAll();
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.ERROR_MESSAGE_UPDATE"), this.translate.instant("STUDY.TOAST.ERROR"), {
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
  @Input() study: string;
  stageForm: FormGroup;
  studies: Study[];
  loading: Boolean;

  constructor(@Inject(MAT_DIALOG_DATA)
    public stage: Stage,
    private formBuilder: FormBuilder,
    private router: Router,
    private stageService: StageService,
    private studyService: StudyService,
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

    this.studyService.getStudies().subscribe(
      response => {
        this.studies = response['studys'];
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("STAGE.TOAST.ERROR"), {
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
    stage.study = this.stage.study;
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

