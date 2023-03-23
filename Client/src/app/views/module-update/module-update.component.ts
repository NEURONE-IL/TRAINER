import { Component, HostListener, Inject, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Flow, FlowService } from 'src/app/services/trainer/flow.service';
import { Module, ModuleService } from 'src/app/services/trainer/module.service'

@Component({
  selector: 'app-module-update',
  templateUrl: './module-update.component.html',
  styleUrls: ['./module-update.component.css']
})
export class ModuleUpdateComponent implements OnInit, OnDestroy {
  @Input() flow: string;
  moduleForm: FormGroup;
  flows: Flow[];
  loading: Boolean;
  file: File;

  edit_users : String[] = [];
  editMinutes: number = 2;
  timerId: NodeJS.Timeout;
  timer: string = '2:00';
  timerColor: string = 'primary'; 

  constructor(@Inject(MAT_DIALOG_DATA)
              public module: Module,
              private formBuilder: FormBuilder,
              private matDialog: MatDialog,
              private moduleService: ModuleService,
              private flowService: FlowService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private authService: AuthService) { }

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
    this.requestEdit();

    this.loading = false;
  }
  ngOnDestroy(): void{
    let user = this.authService.getUser();
    clearInterval(this.timerId);
    this.moduleService.closeEventSourcebyUrl(this.module._id,user._id);
    this.releaseModule();
  }
  @HostListener('window:beforeunload', ['$event'])
  doSomething($event){
    this.ngOnDestroy();
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
    let user = this.authService.getUser();
    
    let formData = new FormData();
    formData.append('name', module.name);
    formData.append('description', module.description);
    formData.append('code', module.code);
    formData.append('userEdit', user._id);
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

  countdown(){
    var time: number = this.editMinutes * 60 - 1;
    this.timerId = setInterval(() => {
      if(time >= 0){
        const minutes = Math.floor(time / 60);
        var seconds = time % 60;
        var displaySeconds = (seconds < 10) ? "0" + seconds : seconds;
        this.timer = minutes + ":" + displaySeconds;
        time--;
        if(time == 60)
          this.timerColor = 'warn';
      }
      else{
        this.matDialog.closeAll();
        clearInterval(this.timerId);
      }
    }, 1000);
  }
  requestEdit(){
    let user_id = this.authService.getUser()._id;
    this.moduleService.requestForEdit(this.module._id,{user:user_id}).subscribe(
      response=> {
        this.edit_users = response.users;
        this.updateStatusForm(1)
        if(this.edit_users[0] != user_id){
          this.moduleService.getServerSentEvent(this.module._id, user_id).subscribe(
            response => {
              let data = JSON.parse(response.data);
              console.log(data);
              this.edit_users = data.currentUsers;
              if(this.edit_users[0] === user_id){
                this.updateStatusForm(0);
                this.moduleService.closeEventSourcebyUrl(this.module._id,user_id);
              }
            },
            err => {
              console.log(err)
            });
        }
      },
      err => {
        console.log(err);
      }
    )
  }
  releaseModule(){
    let user_id = this.authService.getUser()._id;
    this.moduleService.releaseForEdit(this.module._id, {user:user_id}).subscribe(
      module => {
        console.log('Module Release');
      },
      err => {
        console.log(err)
      }
    );
  }
  getModule(){
    this.moduleService.getModule(this.module._id).subscribe(
      response => {
        console.log(response.module);
        this.module = response.module;
        this.updateModuleField();
    }, 
    err => {
      console.log(err)
    })
  }
  updateModuleField(){
    this.moduleForm.controls['name'].setValue(this.module.name);
    this.moduleForm.controls['description'].setValue(this.module.description);
    this.moduleForm.controls['code'].setValue(this.module.code);

  }
  updateStatusForm(state: number){
    let user_id = this.authService.getUser()._id;
    if(!(this.edit_users[0] === user_id)){
      console.log('No puede editar')
      this.moduleForm.disable();
      this.toastr.warning('El módulo está siendo editado por alguien más, una vez que el usuario termine, podrá editarlo', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
    }
    else if(this.edit_users[0] === user_id){
      console.log('Puede editar!')
      this.countdown();
      this.moduleForm.enable();
      if(state != 1){
        this.getModule();
        this.toastr.info('El módulo puede ser editado ahora', 'Información', {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    }
  }
}
