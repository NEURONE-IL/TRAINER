import {Component, Inject, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Flow, FlowService } from '../../services/trainer/flow.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
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
export class FlowUpdateComponent implements OnInit{
  flowForm: FormGroup;
  loading: Boolean;
  file: File;

  myControl = new FormControl();
  collaborators_users: any[];
  collaborators_selected: any[] = [];
  tags: String[] = [];
  collaborator_selected: any;
  collaborator_status: boolean = true;
  privacies = [
    {privacy:"Público", value: false}, 
    {privacy:"Privado", value: true}
  ];
  edit_users : String[] = [];
  userOwner: boolean;
  flow: Flow;


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private formBuilder: FormBuilder,
    private flowService: FlowService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private authService: AuthService,
    public matDialog: MatDialog) { 
      console.log(this.data)
      this.flow = this.data.flow;
      this.userOwner = this.data.userOwner;
    }

  ngOnInit(): void {

    this.tags = this.flow.tags.slice();
    this.flowForm = this.formBuilder.group({
      name: [this.flow.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [this.flow.description, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],

      sorted: [this.flow.sorted, [Validators.required]],

      privacy: this.flow.privacy,
      collaborators: this.flow.collaborators,
      tags:['',[Validators.minLength(3), Validators.maxLength(15), tagExist(this.tags)]],
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

    let user = this.authService.getUser();

    formData.append('name', flow.name);
    formData.append('description', flow.description);
    formData.append('sorted', this.flow.sorted.toString());

    formData.append('user', user._id);
    formData.append('collaborators', JSON.stringify(this.flow.collaborators));
    formData.append('tags', JSON.stringify(this.tags));
    
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
}