import { Component, OnInit , Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StageService } from '../../services/trainer/stage.service';
import { Study, StudyService } from '../../services/trainer/study.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ApiTriviaService, TriviaStudy } from '../../services/apiTrivia/apiTrivia.service';

@Component({
  selector: 'app-stage-creation',
  templateUrl: './stage-creation.component.html',
  styleUrls: ['./stage-creation.component.css']
})
export class StageCreationComponent implements OnInit {
  @Input() study: string;
  stageForm: FormGroup;
  studies: Study[];
  loading: Boolean;
  steps: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  typeOptions: string[] = ['Trivia', 'SG', 'Video'];
  currentLinks: any[];
  triviaLinks: TriviaStudy[];
  SGLinks: TriviaStudy[] = [
    {
      _id: "007",
      name: "Test SG",
      description: "Ejemplo de estudio",
      domain: "No disponible",
      gm_code: "game_group_test",
      cooldown: 10000,
      createdAt: "2021-03-23T21:18:57.536Z",
      updatedAt: "2021-03-23T21:18:57.536Z",
      image_id: "605a5b41b2a3e490ed5b8f61",
      image_url: "https://sg.neurone.info/api/image/00c8389e9dbea9d8fda4f95768de5894.jpg",
      max_per_interval: 1,
    }
  ];
  videoLinks: object[] = [
    {
      name: "Módulo de vídeos",
      _id: "http://localhost:4200/videoModule"
    }
  ]

  constructor(private formBuilder: FormBuilder,
              private stageService: StageService,
              private studyService: StudyService,
              private toastr: ToastrService,
              private translate: TranslateService,
              private triviaService: ApiTriviaService) { }

  ngOnInit(): void {

    this.getApiStudies();

    this.stageForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      step: ['', [Validators.required]],
      type: ['', [Validators.required]],
      link: ['', [Validators.required]]
    });

    this.studyService.getStudies().subscribe(
      response => {
        this.studies = response['studys'];
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("STAGE.TOAST.ERROR"), {
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

  resetForm() {
    this.stageForm.reset();
  }

  createStage(){
    this.loading = true;
    let stage = this.stageForm.value;
    stage.study = this.study;
    this.stageService.postStage(stage).subscribe(
      stage => {
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
  }

  getApiStudies(){
    this.triviaService.getStudies().subscribe((res: any) => {
      this.triviaLinks = res.studys;
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
      this.currentLinks = this.videoLinks;
    }
  }
}
