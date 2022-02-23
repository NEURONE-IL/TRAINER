import { Component, OnInit, SimpleChanges } from '@angular/core';
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

  quiz;
  video;
  status;
  quizId;
  videoId;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const id = params.id;
      this.quizId = id;

      this.quizService.getQuiz2(this.quizId).subscribe(res => {
        console.log(res);
        const idVid = res['data']['video_id'];
        this.videoId = idVid;
      });
    });

  }


  videoResponse(valueVideo) {
    this.status = valueVideo;
    this.showQuiz();
  }

  quizResponse(valueQuiz){
    this.status = valueQuiz;
    if(this.status === 'Atras'){
      this.showVideo();
    }
  }

  showQuiz(){
    this.quiz = true;
    this.video = false;
  }

  showVideo(){
    this.video = true;
    this.quiz = false;
  }


}
