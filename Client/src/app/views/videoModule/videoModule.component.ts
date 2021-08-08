import { Component, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-video-module',
  templateUrl: './videoModule.component.html',
  styleUrls: ['./videoModule.component.css']
})
export class VideoModuleComponent implements OnInit {

  constructor( ) { }

  quiz;
  video;
  videoNumber = 0;
  quizNumber = 0;
  status;

  ngOnInit(): void {
  }

  videoResponse(valueVideo) {
    this.status = valueVideo;
    this.showQuiz(this.videoNumber);
    if(this.videoNumber != 3) {
      this.videoNumber++;
    }
  }

  quizResponse(valueQuiz){
    this.status = valueQuiz;
    if(this.quizNumber != 3){
      this.quizNumber++;
      this.showVideo(this.quizNumber);
    }
  }

  showQuiz(quizNumber){
    this.quiz = true;
    this.video = false;
    this.quizNumber = quizNumber;
  }

  showVideo(videoNumber){
    this.video = true;
    this.quiz = false;
    this.videoNumber = videoNumber;
  }


}
