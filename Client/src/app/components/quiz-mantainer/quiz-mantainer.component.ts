import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { QuizService } from '../../services/videoModule/quiz.service';
import {ActivatedRoute} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VideoComponent } from '../video/video.component';
import { QuizComponent } from '../quiz/quiz.component';


@Component({
  selector: 'app-quiz-mantainer-component',
  templateUrl: './quiz-mantainer.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./quiz-mantainer.component.css']
})
export class QuizMantainerComponent implements OnInit{
 verQuizes = true;
 quizzes;

  constructor(private quizService: QuizService,
              public matDialog: MatDialog) {  }

 ngOnInit(): void{
   this.quizService.getQuizzes().subscribe(res => {
     this.quizzes = res.data;
   });
 }

  crearQuizToogle(){
    this.verQuizes = !this.verQuizes;
  }


  nDeEjercicios(quiz: any) {
    const exercises = quiz.exercises;
    return exercises.length;
  }

  openVideoModal(videoId): void {
    const modal = this.matDialog.open(VideoComponent, {
      width: '100%'
    });
    const data = modal.componentInstance;
    data.videoNumber = videoId;
    data.saveUserData = 'No';
  }

  openQuizComponent(quizId): void {
    const modal = this.matDialog.open(QuizComponent, {
      width: '100%',
      autoFocus: false,
      maxHeight: '90vh'
    });
    const data = modal.componentInstance;
    data.quizNumber = quizId;
    data.saveUserData = 'No';
  }
}
