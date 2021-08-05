import { Component, OnInit , Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StageService } from '../../services/trainer/stage.service';
import { Study, StudyService } from '../../services/trainer/study.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stage-creation',
  templateUrl: './stage-creation.component.html',
  styleUrls: ['./stage-creation.component.css']
})
export class StageCreationComponent implements OnInit {
  @Input() study: string;
  stageForm: FormGroup;
  studies: Study[];
  loading: Boolean;

  constructor(private formBuilder: FormBuilder, 
              private router: Router, 
              private stageService: StageService, 
              private studyService: StudyService, 
              private toastr: ToastrService, 
              private translate: TranslateService) { }

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

  resetForm() {
    this.stageForm.reset();
  }

  createStage(){
    this.loading = true;
    let stage = this.stageForm.value;
    stage.study = this.study;
    this.stageService.postStage(stage).subscribe(
      stage => {
        this.toastr.success(this.translate.instant("STAGE.TOAST.SUCCESS_MESSAGE") + ': ' + stage['stage'].title, this.translate.instant("STAGE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
        this.loading = false;
      },
      err => {
        this.toastr.error(this.translate.instant("STAGE.TOAST.ERROR_MESSAGE"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
}
