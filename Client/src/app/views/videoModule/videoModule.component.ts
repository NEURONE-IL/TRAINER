import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {QuizService} from '../../services/videoModule/quiz.service';
import {StageService} from '../../services/trainer/stage.service';

@Component({
  selector: 'app-video-module',
  templateUrl: './videoModule.component.html',
  styleUrls: ['./videoModule.component.css']
})
export class VideoModuleComponent implements OnInit {

  constructor( private activatedRoute: ActivatedRoute,
               private quizService: QuizService,
               private stageService: StageService) { }

  status;
  quizId;
  videoId;
  videoActive= true;
  quizActive;
  saveData;

  stageId;
  flowId;
  userId;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.quizId = params.id;
      console.log(this.quizId)
      this.quizService.getQuiz(this.quizId).subscribe(res => {
        console.log(res);
        this.videoId = res.data.video_id;
        this.select("video");
      });
    });

    this.saveData = 'Yes';
    this.stageId = localStorage.getItem('stageId', );
    this.userId = JSON.parse(localStorage.getItem('currentUser', ))._id;
    this.stageService.getStage(this.stageId).subscribe(res => {
      this.flowId = res['stage'].flow;
    });
  }

  select(nombre) {
    if (nombre === 'video') {
      this.videoActive = true;
      this.quizActive = false;
    }
    else {
      this.videoActive = false;
      this.quizActive = true;

    }
  }

  videoResponse(valueVideo) {
    this.status = valueVideo;
  }

  quizResponse(valueQuiz){
    this.status = valueQuiz;
  }


  updateProgress(percentage) {
    console.log('- Actualizar progreso -');
    console.log('UserId: ', this.userId);
    console.log('StageId: ', this.stageId);
    console.log('FlowId: ', this.flowId);
    // this.stageService.updateProgress(this.userId, this.flowId, this.stageId, percentage).subscribe(res => {});
  }

}
