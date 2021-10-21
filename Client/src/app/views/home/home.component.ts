import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ApiTriviaService } from '../../services/apiTrivia/apiTrivia.service';
import { ApiSGService } from '../../services/apiSG/apiSG.service';
import { StudyProgress, StageService } from '../../services/trainer/stage.service';
import { FlowService } from '../../services/trainer/flow.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              public authService: AuthService,
              private router: Router,
              private toastr: ToastrService,
              private apiSGService: ApiSGService,
              private flowService: FlowService,
              private stageService: StageService,
              private translate: TranslateService,
              private triviaService: ApiTriviaService) { }

  flow;
  user;
  flowId;
  apikey = this.triviaService.apiKey;
  stages;
  progress: StudyProgress[];

  ngOnInit(): void {
    this.getActualUserInformation();
    this.getFlowStagesInformation();
    this.getFlowInformation();
    this.getAdvance();
  }

  getFlowStagesInformation(){
    this.stageService.getStagesByFlow(this.flowId).subscribe((res: any) => {
      this.stages = res.stages;
    } );
  }
  getFlowInformation(){
    this.flowService.getFlow(this.flowId).subscribe((res: any) => {
      this.flow = res.flow;
    });
  }

  getActualUserInformation(){
    this.user = this.authService.getActualUserInformation();
    this.flowId = this.authService.getActualUserInformation().flow;
  }
  goToStage(stage){
    console.log(stage);
    if (stage.type === 'Video'){
      this.stageVisited(stage);
      this.router.navigate(['/videoModule']);
    }
    if (stage.type === 'Trivia'){
      this.stageVisited(stage);
      window.location.href = this.triviaService.getStudyLink(stage.link, this.user);
      console.log(this.triviaService.getStudyLink(stage.link, this.user));
    }
    if (stage.type === 'SG'){
      this.stageVisited(stage);
      window.location.href = this.apiSGService.getAdventureLink(stage.link);
      return;
    }
  }
  getApiKey(){
    this.triviaService.getApiKey().subscribe((res) => {
      console.log(res);
    });
  }

  getApiStudies(){
    this.triviaService.getStudies().subscribe((res) => {
      console.log(res);
    });
  }

  getAdvance(){
    this.triviaService.getProgress(this.user._id).subscribe((response) => {
      console.log(response, 'progress');
      this.progress = response['progress'];
      this.progress.forEach(element => {
        console.log('elementAdv', element)
        this.stageService.updateProgress(this.user._id, this.flowId, element.study._id, element.percentage).subscribe(response => {
          this.stages = response['stages'];
//          console.log(response, 'TRAINER UpdateProgress');
        });        
      });
    });
  }

  stageVisited(stage){
    return;
  }
  getClass(type){
    if (type === 'Trivia'){
      return 'Trivia';
    }
    else if (type === 'SG'){
      return 'SG';
    }
    else if (type === 'Video'){
      return 'Video';
    }
  }
}

