import { Component, Inject, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-stage-update',
  templateUrl: 'stage-update.component.html',
  styleUrls: ['./stage-update.component.css']
})
export class StageUpdateComponent implements OnInit{
  @Input() flow: string;
  stageForm: FormGroup;
  flows: Flow[];
  loading: Boolean;
  steps: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  typeOptions: string[] = ['Trivia', 'SG', 'Video', 'Video + Quiz'];
  currentLinks: any[];
  triviaLinks: TriviaStudy[];
  SGLinks: SGGame[] = [];
  file: File;
  assistants: any;
  modules: [];
  module: any;

  constructor(@Inject(MAT_DIALOG_DATA)
    public stage: Stage,
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
    private assistantService: AssistantService) { }

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

    this.loading = false;
  }

  get stageFormControls(): any {
    return this.stageForm['controls'];
  }

  getApiStudies(){
    this.triviaService.getStudies().subscribe((res: any) => {
      this.triviaLinks = res.studys;
      this.initLinks(this.stage.type);
    });
    this.apiSGService.getStudies().subscribe((res: any) => {
      console.log("ESTUDIOS RESCATADOS DESDE SG:");
      console.log("ESTUDIOS RESCATADOS DESDE SG:");
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
    else if(type === 'SG'){
      this.currentLinks = this.SGLinks;
    }
    else if(type === 'Video'){
      this.currentLinks = [];
      this.videoModuleService.getVideos().subscribe(res => {
        for (const video of res['data']){
          this.currentLinks.push({"name": video["name"], "_id": video["_id"]});
        }
      });
    }
    else if(type === 'Video + Quiz'){
      this.currentLinks = [];
      this.videoModuleService.getQuizzes().subscribe(res => {
        for (const quiz of res['data']){
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
    let type = stage.type;
    let externalId = stage.externalId;
    let assistant = stage.assistant;
    /*End stage FormData*/
    if(this.file){
      formData.append('file', this.file);
    }
    this.stageService.putStage(stageId, stage).subscribe(
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
    else if(value === 'SG'){
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
      this.currentLinks = [];
      this.videoModuleService.getQuizzes().subscribe(res => {
        for (const quiz of res['data']){
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
}
