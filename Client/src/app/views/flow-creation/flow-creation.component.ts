import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlowService } from '../../services/trainer/flow.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flow-creation',
  templateUrl: './flow-creation.component.html',
  styleUrls: ['./flow-creation.component.css']
})
export class FlowCreationComponent implements OnInit {
  flowForm: FormGroup;
  loading: boolean;
  file: File;

  constructor(
    private formBuilder: FormBuilder,
    private flowService: FlowService,
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router) { }

  ngOnInit(): void {
    this.flowForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      sorted: ['', [Validators.required]]
    });
    this.loading = false;
  }

  get flowFormControls(): any {
    return this.flowForm['controls'];
  }

  resetForm() {
    this.flowForm.reset();
  }

  createFlow(){
    this.loading = true;
    let flow = this.flowForm.value;
    let formData = new FormData();
    formData.append('name', flow.name);
    formData.append('description', flow.description);
    /*Type*/
    if(flow.sorted){
      formData.append('sorted', 'true');
    }
    else{
      formData.append('sorted', 'false');
    }
    /*End Type*/
    if(this.file){
      formData.append('file', this.file);
    }
    this.flowService.postFlow(formData).subscribe(
      flow => {
        this.authService.signupTestUser(flow.flow._id).subscribe(
          user => {
            this.toastr.success(this.translate.instant("FLOW.TOAST.SUCCESS_MESSAGE") + ': ' + flow['flow'].name, this.translate.instant("FLOW.TOAST.SUCCESS"), {
              timeOut: 5000,
              positionClass: 'toast-top-center'
            });
            this.resetForm();
            this.loading = false;
            this.router.navigate(['admin_panel']);
          },
          err => {
            this.toastr.error(this.translate.instant("FLOW.TOAST.ERROR_MESSAGE"), this.translate.instant("FLOW.TOAST.ERROR"), {
              timeOut: 5000,
              positionClass: 'toast-top-center'
            });
          }
        )
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.ERROR_MESSAGE"), this.translate.instant("FLOW.TOAST.ERROR"), {
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
