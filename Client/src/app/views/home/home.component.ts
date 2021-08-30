import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ApiTriviaService } from '../../services/apiTrivia/apiTrivia.service';
import { ApiSGService } from '../../services/apiSG/apiSG.service';
import { StageService } from '../../services/trainer/stage.service';
import { FlowService } from '../../services/trainer/flow.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private toastr: ToastrService,
              private apiSGService: ApiSGService,
              private flowService: FlowService,
              private stageService: StageService,
              private translate: TranslateService,
              private triviaService: ApiTriviaService) { }

  flow;
  user;
  flowId = '611d2ced4338490677404a91';
  apikey = this.triviaService.apiKey;
  stages;

  ngOnInit(): void {
    this.getActualUserInformation();
    this.getFlowStagesInformation();
    this.getFlowInformation();
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
    console.log(this.user);
  }
  goToStage(stage){
    console.log(stage);
    if (stage.type === 'Video'){
      this.stageVisited(stage);
      this.router.navigate(['/videoModule']);
    }
    if (stage.type === 'Trivia'){
      this.stageVisited(stage);
      window.location.href = this.triviaService.getStudyLink(stage.link);
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

