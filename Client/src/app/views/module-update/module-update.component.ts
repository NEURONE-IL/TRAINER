import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Flow, FlowService } from 'src/app/services/trainer/flow.service';
import { Module, ModuleService } from 'src/app/services/trainer/module.service'

@Component({
  selector: 'app-module-update',
  templateUrl: './module-update.component.html',
  styleUrls: ['./module-update.component.css']
})
export class ModuleUpdateComponent implements OnInit {
  @Input() flow: string;
  moduleForm: FormGroup;
  flows: Flow[];
  loading: Boolean;
  file: File;

  constructor(@Inject(MAT_DIALOG_DATA)
              public module: Module,
              private formBuilder: FormBuilder,
              private matDialog: MatDialog,
              private moduleService: ModuleService,
              private flowService: FlowService,
              private toastr: ToastrService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.moduleForm = this.formBuilder.group({
      name: [this.module.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [this.module.description, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      code: [this.module.code, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]]
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

  updateModule(moduleId: string){
    this.loading = true;
    let module = this.moduleForm.value;
    /*Module properties*/
    module.flow = this.module.flow;
    /*End module properties*/
    /*Module FormData*/
    let formData = new FormData();
    formData.append('name', module.name);
    formData.append('description', module.description);
    formData.append('code', module.code);
    formData.append('flow', module.flow);
    /*End module FormData*/
    if(this.file){
      formData.append('file', this.file);
    }
    this.moduleService.putModule(moduleId, formData).subscribe(
      module => {
        this.toastr.success(this.translate.instant("MODULE.TOAST.SUCCESS_MESSAGE_UPDATE") + ': ' + module['module'].name, this.translate.instant("MODULE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
        this.loading = false;
      },
      err => {
        this.toastr.error(this.translate.instant("MODULE.TOAST.ERROR_MESSAGE_UPDATE"), this.translate.instant("MODULE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
    this.closeDialog();
  }

  cancelAndReturn(){
    this.matDialog.closeAll();
  }

  closeDialog(){
    this.matDialog.closeAll();
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }
}
