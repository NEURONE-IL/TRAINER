import { Component, OnInit, SimpleChanges } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-video-module',
  templateUrl: './videoModule.component.html',
  styleUrls: ['./videoModule.component.css']
})
export class VideoModuleComponent implements OnInit {

  constructor( private activatedRoute: ActivatedRoute ) { }

  quiz;
  video;
  status;
  idNumber;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const id = params.id;
      this.idNumber = id;
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
