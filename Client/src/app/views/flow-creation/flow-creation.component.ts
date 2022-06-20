import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl, FormControl } from '@angular/forms';
import { FlowService } from '../../services/trainer/flow.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FlowResourcesService } from 'src/app/services/admin/flow-resources.service';

export function notThisUser(user): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(user != null){
      control.markAsTouched();
      const isValid = user.email !== control.value;
      return isValid ? null : { 'notThisUser': true };
    }
    
  };
}
export function tagExist(tags): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if(tags != null && control.value != null){
      control.markAsTouched();
      const isValid = tags.some(tag => control.value.toLowerCase() === tag.toLowerCase());
      return isValid ? { 'tagExist': true }: null;
    }
    
  };
}

@Component({
  selector: 'app-flow-creation',
  templateUrl: './flow-creation.component.html',
  styleUrls: ['./flow-creation.component.css']
})
export class FlowCreationComponent implements OnInit {
  flowForm: FormGroup;
  loading: boolean;
  file: File;

  //Valentina
  user : any;
  collaborator_status: boolean = false;
  collaborator_selected: any;
  collaborators_selected: any[] = [];

  privacies = [
    {privacy:"Público", value: false}, 
    {privacy:"Privado", value: true}
  ];

  languages : any[]
  tags: string[] = [];
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  competences: any[];

  constructor(
    private formBuilder: FormBuilder,
    private flowService: FlowService,
    private flowResourcesService: FlowResourcesService,
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.flowResourcesService.getCompetences().subscribe( response => {
      this.competences = response.competences;
      console.log(this.competences)
      this.competences.sort( (a,b) => a.name.localeCompare(b.name))
    }, err => {
      console.log(err)
    });

    this.flowResourcesService.getLanguages().subscribe( response => {
      this.languages = response.languages;
      console.log(this.languages)
      this.languages.sort( (a,b) => a.name.localeCompare(b.name))
    }, err => {
      console.log(err)
    });

    console.log(this.user)
    this.flowForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      sorted: ['', [Validators.required]],

      privacy: ['', [Validators.required]],
      collaborators: ['', {validators: [Validators.email, notThisUser(this.user)], updateOn:'change'}],
      tags:['',[Validators.minLength(3), Validators.maxLength(15),tagExist(this.tags)]],
      levels:['',[Validators.required]],
      competences:['',[Validators.required]],
      language:['',[Validators.required]]
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
    //this.loading = true;
    let flow = this.flowForm.value;
    let formData = new FormData();
    console.log(flow)
    let collaborators = [];
    if(this.collaborators_selected.length > 0)
      this.collaborators_selected.forEach(coll => collaborators.push({user:coll, invitation:'Pendiente'}))
    
    console.log(collaborators);
    console.log(this.tags);

    formData.append('name', flow.name);
    formData.append('description', flow.description);
    formData.append('user', this.user._id); //Entregar ID del usuario
    formData.append('privacy', flow.privacy);
    formData.append('collaborators', JSON.stringify(collaborators));
    formData.append('tags', JSON.stringify(this.tags));
    formData.append('levels', JSON.stringify(flow.levels));
    formData.append('competences', JSON.stringify(flow.competences));
    formData.append('language', JSON.stringify(flow.language));

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

  changeStatus(event){
    this.collaborator_status = event.checked
  }
  verifyCollaborator(){
    let email = this.flowFormControls.collaborators.value;
    console.log(email)

    let emailExist: boolean;
    this.collaborators_selected.forEach(coll => {
      if(coll.email === email){
        emailExist = true;
        return
      }
        
    })
    if(emailExist || email === '' || this.flowFormControls.collaborators.status === 'INVALID'){
      return
    }
    let collaborator: any;
  
    this.authService.getUserbyEmail(email).subscribe(
      response => {
        collaborator = response['user']
        this.collaborators_selected.push(collaborator);
        this.flowFormControls.collaborators.setValue('');
        this.toastr.success(collaborator.email + " añadido exitosamente", "Éxito", {
          timeOut: 5000,
          positionClass: 'toast-top-center'});

      },
      (err) => {
        let error = err.error.message;
          if(error === 'EMAIL_NOT_FOUND'){
            this.toastr.error("No se encuentra el correo ingresado", "Usuario Inexistente", {
              timeOut: 5000,
              positionClass: 'toast-top-center'});
              return
            }

            if(error === 'ROLE_INCORRECT'){
            this.toastr.error("El usuario ingresado no cuenta con permisos de colaborador", "Usuario Incorrecto", {
              timeOut: 5000,
              positionClass: 'toast-top-center'});
              return
            }

            if(error === 'USER_NOT_CONFIRMED'){
            this.toastr.error("El usuario ingresado no ha terminado su proceso de registro", "Usuario no confirmado", {
              timeOut: 5000,
              positionClass: 'toast-top-center'});
              return
            }
      }
    );
  }
  addTag(){
    let tag = this.flowForm.value.tags;
    const value = (tag || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push(value.toLowerCase());
      this.flowFormControls.tags.setValue('');
    }
  }
  removeCollaborator(user: any): void {
    console.log(this.collaborators_selected)
    const index = this.collaborators_selected.indexOf(user);

    if (index >= 0) {
      this.collaborators_selected.splice(index, 1);
    }
    console.log(this.collaborators_selected)

  }
  removeTag(tag: string): void {
    console.log(tag)
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    console.log(this.tags)

  }

}
