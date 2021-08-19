import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { Stage, StageService } from '../../services/trainer/stage.service';
import {Study, StudyService} from "../../services/trainer/study.service";
import {ApiTriviaService} from "../../services/apiTrivia/apiTrivia.service";
import { ApiSGService } from '../../services/apiSG/apiSG.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'show-flow',
  templateUrl: './show-flow.component.html',
  encapsulation: ViewEncapsulation.Emulated, // ???
  styleUrls: ['./show-flow.component.css']
})
export class ShowFlowComponent implements OnInit {

  @Input() studyId: string;
  @Input() studentId: string;
  study: Study;
  stages = [];
  sortedStages: Stage[] = [];

  constructor(
    private stageService: StageService,
    private studyService: StudyService,
    private triviaService: ApiTriviaService,
    private router: Router,
    private toastr: ToastrService,
    private apiSGService: ApiSGService
  ) { }

  ngOnInit(): void {
    this.stageService.getStageByStudent(this.studentId)
      .subscribe(response => {
        this.sortedStages = response['stages'];
      });
  }
  getClass(active, type){
    if(!active){
      return 'Disabled';
    }
    if(type === 'Trivia'){
      return 'Trivia';
    }
    else if(type === 'SG'){
      return 'SG';
    }
    else if(type === 'Video'){
      return 'Video';
    }
  }

  goToStage(stage){
    console.log(stage);
    if (stage.type === 'Video'){
      this.router.navigate(['/videoModule']);
    }
    if (stage.type === 'Trivia'){
      window.location.href = this.triviaService.getStudyLink(stage.externalId);
    }
    if (stage.type === 'SG'){
      window.location.href = this.apiSGService.getAdventureLink(stage.externalId);
      return;
    }
  }

  getLinkToTriviaStudy(studyId){
    return this.triviaService.getStudyLink(studyId);
  }

  formatDate(date){
    return date.substr(0,10);
  }

  updateProgress(stageId){
    this.stageService.updateProgress(this.studentId, stageId, 100).subscribe(response => {
      this.sortedStages = response['stages'];
    });
  }
}
