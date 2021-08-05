import { Component, OnInit } from '@angular/core';

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

  ngOnInit(): void {
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
