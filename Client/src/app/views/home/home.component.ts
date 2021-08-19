import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ApiTriviaService } from '../../services/apiTrivia/apiTrivia.service';
import { ApiSGService } from '../../services/apiSG/apiSG.service';
import { StageService } from '../../services/trainer/stage.service';
import { StudyService } from '../../services/trainer/study.service';


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
              private studyService: StudyService,
              private stageService: StageService,
              private translate: TranslateService,
              private triviaService: ApiTriviaService) { }

  study;
  user;
  studyId = '611d2ced4338490677404a91';
  apikey = this.triviaService.apiKey;
  stages;
  ngOnInit(): void {
    this.getActualUserInformation();
    this.getStudyStagesInformation();
    this.getStudyInformation();
  }

  getStudyStagesInformation(){
    this.stageService.getStagesByStudy(this.studyId).subscribe((res: any) => {
      this.stages = res.stages;
    } );
  }
  getStudyInformation(){
    this.studyService.getStudy(this.studyId).subscribe((res: any) => {
      this.study = res.study;
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

