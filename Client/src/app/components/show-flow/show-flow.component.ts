import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { Stage, StageService } from '../../services/trainer/stage.service';
import {Study, StudyService} from "../../services/trainer/study.service";
import {ApiTriviaService} from "../../services/apiTrivia/apiTrivia.service";

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
  stages: Stage[] = [];
  sortedStages: Stage[] = [];

  constructor(
    private stageService: StageService,
    private studyService: StudyService,
    private triviaService: ApiTriviaService
  ) { }

  ngOnInit(): void {
    this.stageService.getStagesByStudySortedByStep(this.studyId)
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

  getLinkToTriviaStudy(studyId){
    return this.triviaService.getStudyLink(studyId);
  }

  formatDate(date){
    return date.substr(0,10);
  }
}
