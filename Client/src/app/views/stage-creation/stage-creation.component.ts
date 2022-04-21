import { Component, OnInit , Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StageService } from '../../services/trainer/stage.service';
import { Flow, FlowService } from '../../services/trainer/flow.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ApiTriviaService, TriviaStudy } from '../../services/apiTrivia/apiTrivia.service';
import { ApiSGService, SGGame } from '../../services/apiSG/apiSG.service';
import { QuizService } from '../../services/videoModule/quiz.service';
import { ModuleService } from 'src/app/services/trainer/module.service';
import { AssistantService } from 'src/app/services/assistant/assistant.service';
import {MatDialogRef} from '@angular/material/dialog';
import {FlowDisplayComponent} from '../flow-display/flow-display.component';



@Component({
  selector: 'app-stage-creation',
  templateUrl: './stage-creation.component.html',
  styleUrls: ['./stage-creation.component.css']
})
export class StageCreationComponent implements OnInit {
  modules: [];
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

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<FlowDisplayComponent>,
              private moduleService: ModuleService,
              private stageService: StageService,
              private flowService: FlowService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private videoModuleService: QuizService,
              private apiTriviaService: ApiTriviaService,
              private apiSGService: ApiSGService,
              private triviaService: ApiTriviaService,
              private assistantService: AssistantService) { }

  ngOnInit(): void {

    this.getApiStudies();
    this.getModules();
    this.getAssistants();
    this.stageForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      step: ['', [Validators.required]],
      type: ['', [Validators.required]],
      externalId: ['', [Validators.required]],
      module: ['', []],
      assistant: ['', []],
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

  resetFlowTestUser(){
    this.flowService.resetFlowTestUser(this.flow).subscribe();
  }

  get stageFormControls(): any {
    return this.stageForm['controls'];
  }

  resetForm() {
    this.stageForm.reset();
  }

  createStage(){
    this.loading = true;
    let stage = this.stageForm.value;
    /*Stage properties*/
    stage.flow = this.flow;
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
    this.stageService.postStage(formData).subscribe(
      stage => {
        if(type === "Trivia"){
          this.apiTriviaService.postAssistant(externalId, assistant).subscribe(
            response => {

            },
            err => {
              console.log(err)
            }
          )
        }
        this.toastr.success(this.translate.instant("STAGE.TOAST.SUCCESS_MESSAGE") + ': ' + stage['stage'].title, this.translate.instant("STAGE.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.resetForm();
        this.loading = false;
      },
      err => {
        this.toastr.error(this.translate.instant("STAGE.TOAST.ERROR_MESSAGE"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
    this.closeDialog();
  }

  closeDialog(){
    this.dialogRef.close();
  }

  getApiStudies(){
    this.triviaService.getStudies().subscribe((res: any) => {
      this.triviaLinks = res.studys;
    });
    this.apiSGService.getStudies().subscribe((res: any) => {
      console.log("ESTUDIOS RESCATADOS DESDE SG:");
      console.log("ESTUDIOS RESCATADOS DESDE SG:");
      console.log("ESTUDIOS RESCATADOS DESDE SG:");
      console.log(res.adventures);
      this.SGLinks = res.adventures;
      console.log(this.SGLinks);
    });
  }

  getModules(){
    this.moduleService.getModuleByFlow(this.flow)
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

    else if(value === 'Video + Quiz'){
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
