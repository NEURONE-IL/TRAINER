import {Component, HostListener, Inject, OnInit, OnDestroy} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Flow, FlowService } from '../../services/trainer/flow.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FlowResourcesService } from 'src/app/services/admin/flow-resources.service';
export function tagExist(tags): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(tags != null){
      control.markAsTouched();
      const isValid = tags.some(tag => control.value.toLowerCase() === tag.toLowerCase());
      return isValid ? { 'tagExist': true }: null;
    }
    
  };
}
@Component({
  selector: 'app-flow-update',
  templateUrl: 'flow-update.component.html',
  styleUrls: ['./flow-update.component.css']
})
export class FlowUpdateComponent implements OnInit, OnDestroy{
  flowForm: FormGroup;
  loading: Boolean;
  file: File;

  myControl = new FormControl();
  collaborators_users: any[];
  collaborators_selected: any[] = [];
  tags: String[] = [];
  collaborator_selected: any;
  privacies = [
    {privacy:"Público", value: false}, 
    {privacy:"Privado", value: true}
  ];
  edit_users : String[] = [];
  userOwner: boolean;
  flow: Flow;
  languages :any[]
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  competences: any[];
  editMinutes: number = 3;
  timerId: NodeJS.Timeout;
  timer: string = '3:00';
  timerColor: string = 'primary'; 


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private formBuilder: FormBuilder,
    private flowService: FlowService,
    private flowResourcesService: FlowResourcesService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private authService: AuthService,
    public matDialog: MatDialog) { 
      console.log(this.data)
      this.flow = this.data.flow;
      this.userOwner = this.data.userOwner;
    }
  
  ngOnDestroy(): void{
    let user = this.authService.getUser();
    clearInterval(this.timerId);
    this.flowService.closeEventSourcebyUrl(this.flow._id,user._id);
    this.releaseFlow();
  }
  @HostListener('window:beforeunload', ['$event'])
  doSomething($event){
    this.ngOnDestroy();
  }
  ngOnInit(): void {
    this.flowResourcesService.getCompetences().subscribe( response => {
      this.competences = response.competences;
      console.log(this.competences)
      this.competences.sort( (a,b) => a.name.localeCompare(b.name))
    }, err => {
      console.log(err)
    })
    this.flowResourcesService.getLanguages().subscribe( response => {
      this.languages = response.languages;
      console.log(this.languages)
      this.languages.sort( (a,b) => a.name.localeCompare(b.name))
    }, err => {
      console.log(err)
    })
    this.tags = this.flow.tags.slice();
    let filteredCompetences :any[] = []
      this.flow.competences.forEach(comp => {
        filteredCompetences.push(comp._id)
      });
    
    this.flowForm = this.formBuilder.group({
      name: [this.flow.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [this.flow.description, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],

      sorted: [this.flow.sorted, [Validators.required]],

      privacy: this.flow.privacy,
      collaborators: this.flow.collaborators,
      tags:['',[Validators.minLength(3), Validators.maxLength(15), tagExist(this.tags)]],
      levels:[this.flow.levels,[Validators.required]],
      competences:[filteredCompetences,[Validators.required]],
      language:[this.flow.language,[Validators.required]]
    });
    this.requestEdit();
    if (this.userOwner) {
      this.flowForm.controls.privacy.enable();
    } else {
      this.flowForm.controls.privacy.disable();
    }
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

    let user = this.authService.getUser();

    formData.append('name', flow.name);
    formData.append('description', flow.description);
    formData.append('sorted', this.flow.sorted.toString());

    formData.append('user', user._id);
    formData.append('collaborators', JSON.stringify(this.flow.collaborators));
    formData.append('tags', JSON.stringify(this.tags));
    formData.append('levels', JSON.stringify(flow.levels));
    formData.append('competences', JSON.stringify(flow.competences));
    formData.append('language', flow.language);
    formData.append('userEdit', user._id);
    
    if (this.userOwner) {
      formData.append('privacy', flow.privacy);
    } 
    else {
      formData.append('privacy', JSON.stringify(this.flow.privacy));
    }

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

  cancelAndReturn(){
    this.matDialog.closeAll();
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }

  //Valentina
  addTag(){
    let tag = this.flowForm.value.tags;
    const value = (tag || '').trim();

    if (value && !(this.flowFormControls.tags.status === 'INVALID')) {
      this.tags.push(value.toLowerCase());
      this.flowFormControls.tags.setValue('');
    }
  }
  removeTag(tag: String): void {
    console.log(tag)
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    console.log(this.tags)

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
    this.flowService.requestForEdit(this.flow._id,{user:user_id}).subscribe(
      response=> {
        this.edit_users = response.users;
        this.updateStatusForm(1)
        if(this.edit_users[0] != user_id){
          this.flowService.getServerSentEvent(this.flow._id, user_id).subscribe(
            response => {
              let data = JSON.parse(response.data);
              console.log(data);
              this.edit_users = data.currentUsers;
              if(this.edit_users[0] === user_id){
                this.updateStatusForm(0);
                this.flowService.closeEventSourcebyUrl(this.flow._id,user_id);
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
  releaseFlow(){
    let user_id = this.authService.getUser()._id;
    this.flowService.releaseForEdit(this.flow._id, {user:user_id}).subscribe(
      flow => {
        console.log('Flow Release');
      },
      err => {
        console.log(err)
      }
    );
  }
  getFlow(){
    this.flowService.getFlow(this.flow._id).subscribe(
      response => {
        console.log(response.flow);
        this.flow = response.flow;
        this.updateFlowField();
    }, 
    err => {
      console.log(err)
    })
  }
  updateFlowField(){
    this.tags = this.flow.tags.slice();
    let filteredCompetences :any[] = [];
    this.flow.competences.forEach(comp => {
      filteredCompetences.push(comp._id)
    });
    this.flowForm.controls['name'].setValue(this.flow.name);
    this.flowForm.controls['description'].setValue(this.flow.description);
    this.flowForm.controls['sorted'].setValue(this.flow.sorted);
    this.flowForm.controls['privacy'].setValue(this.flow.privacy);
    this.flowForm.controls['collaborators'].setValue(this.flow.collaborators);

    this.flowForm.controls['levels'].setValue(this.flow.levels);
    this.flowForm.controls['language'].setValue(this.flow.language);
    this.flowForm.controls['competences'].setValue(filteredCompetences);

  }
  updateStatusForm(state: number){
    let user_id = this.authService.getUser()._id;
    if(!(this.edit_users[0] === user_id)){
      console.log('No puede editar')
      this.flowForm.disable();
      this.flowForm.controls.privacy.disable();
      this.toastr.warning('El flujo está siendo editado por alguien más, una vez que el usuario termine, podrá editarlo', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
    }
    else if(this.edit_users[0] === user_id){
      console.log('Puede editar!')
      this.countdown();
      this.flowForm.enable();
      if (this.userOwner) {
        this.flowForm.controls.privacy.enable();
      } else {
        this.flowForm.controls.privacy.disable();
      }
      if(state != 1){
        this.getFlow();
        this.toastr.info('El flujo puede ser editado ahora', 'Información', {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    }
  }
}