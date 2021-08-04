import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudyService } from '../../services/trainer/study.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-study-creation',
  templateUrl: './study-creation.component.html',
  styleUrls: ['./study-creation.component.css']
})
export class StudyCreationComponent implements OnInit {
  studyForm: FormGroup;
  loading: boolean;
  file: File;

  constructor(
    private formBuilder: FormBuilder,
    private studyService: StudyService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router) { }

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

  createStudy(){
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
    this.studyService.postStudy(formData).subscribe(
      study => {
        this.toastr.success(this.translate.instant("STUDY.TOAST.SUCCESS_MESSAGE") + ': ' + study['study'].name, this.translate.instant("STUDY.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
        this.loading = false;
        this.router.navigate(['admin_panel']);
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.ERROR_MESSAGE"), this.translate.instant("STUDY.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      },
    );
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }
}
