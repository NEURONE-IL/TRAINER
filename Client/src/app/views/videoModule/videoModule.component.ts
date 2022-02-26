import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {QuizService} from '../../services/videoModule/quiz.service';

@Component({
  selector: 'app-video-module',
  templateUrl: './videoModule.component.html',
  styleUrls: ['./videoModule.component.css']
})
export class VideoModuleComponent implements OnInit {

  constructor( private activatedRoute: ActivatedRoute,
               private quizService: QuizService) { }

  status;
  quizId;
  videoId;
  videoActive;
  quizActive;
  saveData;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.quizId = params.id;

      this.quizService.getQuiz2(this.quizId).subscribe(res => {
        console.log(res);
        this.videoId = res.data.video_id;
      });
    });

    this.saveData = "Yes";

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

}
