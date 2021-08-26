import { Component, OnInit , Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModuleService } from '../../services/trainer/module.service';
import { Study, StudyService } from '../../services/trainer/study.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-module-creation',
  templateUrl: './module-creation.component.html',
  styleUrls: ['./module-creation.component.css']
})
export class ModuleCreationComponent implements OnInit {
  @Input() study: string;
  moduleForm: FormGroup;
  studies: Study[];
  loading: Boolean;
  file: File;

  constructor(private formBuilder: FormBuilder,
              private moduleService: ModuleService,
              private studyService: StudyService,
              private toastr: ToastrService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.moduleForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      code: ['', [Validators.required]]
    });

    this.studyService.getStudies().subscribe(
      response => {
        this.studies = response['studys'];
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("MODULE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );

    this.loading = false;
  }

  get moduleFormControls(): any {
    return this.moduleForm['controls'];
  }

  resetForm() {
    this.moduleForm.reset();
  }

  createModule(){
    this.loading = true;
    let module = this.moduleForm.value;
    /*Module properties*/
    module.study = this.study;
    /*End module properties*/
    /*Module FormData*/
    let formData = new FormData();
    formData.append('name', module.name);
    formData.append('description', module.description);
    formData.append('code', module.code);
    formData.append('study', this.study);
    /*End module FormData*/
    if(this.file){
      formData.append('file', this.file);
    }    
    this.moduleService.postModule(formData).subscribe(
      module => {
        this.toastr.success(this.translate.instant("MODULE.TOAST.SUCCESS_MESSAGE") + ': ' + module['module'].name, this.translate.instant("MODULE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
        this.loading = false;
      },
      err => {
        this.toastr.error(this.translate.instant("MODULE.TOAST.ERROR_MESSAGE"), this.translate.instant("MODULE.TOAST.ERROR"), {
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
