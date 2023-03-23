import { Component, HostListener, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Stage, StageService } from '../../services/trainer/stage.service';
import { Flow, FlowService } from '../../services/trainer/flow.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiTriviaService, TriviaStudy } from '../../services/apiTrivia/apiTrivia.service';
import { ApiSGService, SGGame } from '../../services/apiSG/apiSG.service';
import { QuizService } from '../../services/videoModule/quiz.service';
import { ModuleService } from 'src/app/services/trainer/module.service';
import { AssistantService } from 'src/app/services/assistant/assistant.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-stage-update',
  templateUrl: 'stage-update.component.html',
  styleUrls: ['./stage-update.component.css']
})
export class StageUpdateComponent implements OnInit, OnDestroy{
  @Input() flow: string;
  stageForm: FormGroup;
  flows: Flow[];
  loading: Boolean;
  steps: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  typeOptions: string[] = ['Trivia', 'Adventure', 'Video + Quiz'];
  currentLinks: any[];
  triviaLinks: TriviaStudy[];
  SGLinks: SGGame[] = [];
  file: File;
  assistants: any;
  modules: [];
  module: any;
  
  owner: any;
  stage: Stage;
  edit_users : String[] = [];
  editMinutes: number = 2;
  timerId: NodeJS.Timeout;
  timer: string = '2:00';
  timerColor: string = 'primary'; 

  constructor(@Inject(MAT_DIALOG_DATA)
    public data: any,
    private formBuilder: FormBuilder,
    private moduleService: ModuleService,
    private router: Router,
    private stageService: StageService,
    private flowService: FlowService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private apiSGService: ApiSGService,
    private videoModuleService: QuizService,
    private triviaService: ApiTriviaService,
    public matDialog: MatDialog,
    private authService: AuthService,
    private assistantService: AssistantService) { 
      
      console.log(this.data)
      this.stage = this.data.stage;
      this.owner = this.data.owner;
    
    }

  ngOnInit(): void {

    this.getApiStudies();
    this.getModules();
    this.getAssistants();
    console.log(this.stage)
    this.stageForm = this.formBuilder.group({
      title: [this.stage.title, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [this.stage.description, [Validators.minLength(3), Validators.maxLength(250)]],
      step: [this.stage.step, [Validators.required]],
      type: [this.stage.type, [Validators.required]],
      externalId: [this.stage.externalId, [Validators.required]],
      module: [this.stage.module._id, []],
      assistant: [this.stage.assistant, []],
    });

    this.flowService.getFlows().subscribe(
      response => {
        this.flows = response['flows'];
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("STAGE.TOAST.ERROR"), {
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
    this.stageService.closeEventSourcebyUrl(this.stage._id,user._id);
    this.releaseStage();
  }
  @HostListener('window:beforeunload', ['$event'])
  doSomething($event){
    this.ngOnDestroy();
  }

  get stageFormControls(): any {
    return this.stageForm['controls'];
  }

  getApiStudies(){
    this.triviaService.getStudies().subscribe((res: any) => {
      this.triviaLinks = res.studys;
      this.initLinks(this.stage.type);
    });
    this.apiSGService.getAdventures().subscribe((res: any) => {
      console.log("ESTUDIOS RESCATADOS DESDE SG:");
      console.log(res.adventures);
      this.SGLinks = res.adventures;
      console.log(this.SGLinks);
      this.initLinks(this.stage.type);
    });
  }

  initLinks(type: string){
    console.log('init', type);
    if(type === 'Trivia'){
      this.currentLinks = this.triviaLinks;
    }
    else if(type === 'Adventure'){
      this.currentLinks = this.SGLinks;
    }
    
    else if(type === 'Video + Quiz'){
      let user = this.authService.getUser();
      this.currentLinks = [];
      this.videoModuleService.getQuizzesByUser(this.owner._id).subscribe(res => {
        for (const quiz of res['quizzes']){
          this.currentLinks.push({"name": quiz["name"], "_id": quiz["_id"]});
        }
      });
    }
  }

  updateStage(stageId: string){
    this.loading = true;
    let stage = this.stageForm.value;
    /*Stage properties*/
    stage.flow = this.stage.flow;
    let externalObject = this.currentLinks.find(element => element._id === stage.externalId);
    stage.externalName = externalObject.name;
    /*End stage properties*/
    let user = this.authService.getUser();
    /*Stage FormData*/

    let formData = new FormData();
    formData.append('title', stage.title);
    formData.append('description', stage.description);
    formData.append('step', stage.step);
    formData.append('type', stage.type);
    formData.append('externalId', stage.externalId);
    formData.append('flow', stage.flow);
    formData.append('externalName', stage.externalName);
    formData.append('module', stage.module);
    formData.append('assistant', stage.assistant);
    formData.append('userEdit', user._id);


    let type = stage.type;
    let externalId = stage.externalId;
    let assistant = stage.assistant;
    /*End stage FormData*/
    
    if(this.file){
      formData.append('file', this.file);
    }
    this.stageService.putStage(stageId, formData).subscribe(
      stage => {
        if(type === "Trivia"){
          this.triviaService.putAssistant(externalId, assistant).subscribe(
            response => {

            },
            err => {
              console.log(err)
            }
          )
        }
        this.toastr.success(this.translate.instant("STAGE.TOAST.SUCCESS_MESSAGE_UPDATE") + ': ' + stage['stage'].title, this.translate.instant("STAGE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loading = false;
        this.matDialog.closeAll();
      },
      err => {
        this.toastr.error(this.translate.instant("STAGE.TOAST.ERROR_MESSAGE_UPDATE"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  getModules(){
    this.moduleService.getModuleByFlow(this.stage.flow)
          .subscribe(response => {
            this.modules = response['modules'];
     });
  }

  changeLinks(event: any){
    let value = event.value;
    if(value === 'Trivia'){
      this.currentLinks = this.triviaLinks;
    }
    else if(value === 'Adventure'){
      this.currentLinks = this.SGLinks;
    }

    else if(value === 'Video'){
      this.currentLinks = [];
      this.videoModuleService.getVideos().subscribe(res => {
        for (const video of res['data']){
          this.currentLinks.push({"name": video["name"], "_id": video["_id"]});
        }
      });
    }
    else if (value === 'Video + Quiz'){
      let user = this.authService.getUser();
      this.currentLinks = [];
      this.videoModuleService.getQuizzesByUser(this.owner._id).subscribe(res => {
        for (const quiz of res['quizzes']){
          this.currentLinks.push({"name": quiz["name"], "_id": quiz["_id"]});
        }
      });
    }
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }

  cancelAndReturn(){
    this.matDialog.closeAll();
  }

  getAssistants(){
    this.assistantService.getAssistants().subscribe(
      response => {
        this.assistants = response;
      },
      err => {
        /*this.toastr.error(this.translate.instant("FLOW.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });*/
      }
    );
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
    this.stageService.requestForEdit(this.stage._id,{user:user_id}).subscribe(
      response=> {
        this.edit_users = response.users;
        this.updateStatusForm(1)
        if(this.edit_users[0] != user_id){
          this.stageService.getServerSentEvent(this.stage._id, user_id).subscribe(
            response => {
              let data = JSON.parse(response.data);
              console.log(data);
              this.edit_users = data.currentUsers;
              if(this.edit_users[0] === user_id){
                this.updateStatusForm(0);
                this.stageService.closeEventSourcebyUrl(this.stage._id,user_id);
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
  releaseStage(){
    let user_id = this.authService.getUser()._id;
    this.stageService.releaseForEdit(this.stage._id, {user:user_id}).subscribe(
      stage => {
        console.log('Stage Release');
      },
      err => {
        console.log(err)
      }
    );
  }
  getStage(){
    this.stageService.getStage(this.stage._id).subscribe(
      response => {
        console.log(response['stage']);
        this.stage = response['stage'];
        this.updateStageField();
    }, 
    err => {
      console.log(err)
    })
  }
  updateStageField(){
    //let externalObject = this.currentLinks.find(element => element._id === stage.externalId);
    //stage.externalName = externalObject.name;

    this.stageForm.controls['title'].setValue(this.stage.title);
    this.stageForm.controls['description'].setValue(this.stage.description);
    this.stageForm.controls['step'].setValue(this.stage.step);
    this.stageForm.controls['type'].setValue(this.stage.type);
    this.stageForm.controls['externalId'].setValue(this.stage.externalId);
    //this.stageForm.controls['externalName'].setValue(this.stage.externalName);
    this.stageForm.controls['module'].setValue(this.stage.module);
    this.stageForm.controls['assistant'].setValue(this.stage.assistant);

  }
  updateStatusForm(state: number){
    let user_id = this.authService.getUser()._id;
    if(!(this.edit_users[0] === user_id)){
      console.log('No puede editar')
      this.stageForm.disable();
      this.toastr.warning('La etapa está siendo editada por alguien más, una vez que el usuario termine, podrá editarla', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
    }
    else if(this.edit_users[0] === user_id){
      console.log('Puede editar!')
      this.countdown();
      this.stageForm.enable();
      if(state != 1){
        this.getStage();
        this.toastr.info('La etapa puede ser editada ahora', 'Información', {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    }
  }
}
