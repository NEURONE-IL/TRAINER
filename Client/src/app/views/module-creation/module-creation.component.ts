import { Component, OnInit , Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModuleService } from '../../services/trainer/module.service';
import { Flow, FlowService } from '../../services/trainer/flow.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FlowDisplayComponent} from '../flow-display/flow-display.component';

@Component({
  selector: 'app-module-creation',
  templateUrl: './module-creation.component.html',
  styleUrls: ['./module-creation.component.css']
})
export class ModuleCreationComponent implements OnInit {
  @Input() flow: string;
  moduleForm: FormGroup;
  flows: Flow[];
  loading: Boolean;
  file: File;

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<FlowDisplayComponent>,
              private moduleService: ModuleService,
              private flowService: FlowService,
              private toastr: ToastrService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.moduleForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]]
    });

    this.flowService.getFlows().subscribe(
      response => {
        this.flows = response['flows'];
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("MODULE.TOAST.ERROR"), {
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
    module.flow = this.flow;
    /*End module properties*/
    /*Module FormData*/
    let formData = new FormData();
    formData.append('name', module.name);
    formData.append('description', module.description);
    formData.append('code', module.code);
    formData.append('flow', this.flow);
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
        this.closeDialog();
      },
      err => {
        this.toastr.error(this.translate.instant("MODULE.TOAST.ERROR_MESSAGE"), this.translate.instant("MODULE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.closeDialog();
      }
    );
  }

  closeDialog(){
    this.dialogRef.close();
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }
}
