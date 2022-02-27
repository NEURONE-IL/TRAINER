import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

import { trigger, transition, animate, style } from '@angular/animations';
import { QuizService } from '../../services/videoModule/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VideoComponent } from '../video/video.component';
import { QuizComponent } from '../quiz/quiz.component';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-quiz-mantainer-component',
  templateUrl: './quiz-mantainer.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./quiz-mantainer.component.css']
})

export class QuizMantainerComponent implements OnInit{
 verQuizes = true;
 quizzes;
 pregunta="????";
 video;

  constructor(private quizService: QuizService,
              public matDialog: MatDialog,
              private toastr: ToastrService,
              private translate: TranslateService,
              private router: Router) {  }

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

  openQuizModal(quizId): void {
    const modal = this.matDialog.open(QuizComponent, {
      width: '100%',
      autoFocus: false,
      maxHeight: '90vh'
    });
    const data = modal.componentInstance;
    data.quizNumber = quizId;
    data.saveUserData = 'No';
  }

  confirmQuizDelete(quizId){
    confirm(this.translate.instant('QUIZZES.TOAST.DELETE_CONFIRMATION')) && this.deleteQuiz(quizId);
  }

  deleteQuiz(quizId){
    this.quizService.deleteQuiz(quizId).subscribe(quiz => {
      this.quizService.getQuizzes().subscribe(res => this.quizzes = res.data);
      this.toastr.success(this.translate.instant('QUIZZES.TOAST.SUCCESS_MESSAGE_DELETE'), this.translate.instant('QUIZZES.TOAST.SUCCESS'), {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
      this.router.navigate(['admin_panel']);
      }, err => {
      this.toastr.error(this.translate.instant('QUIZZES.TOAST.ERROR_MESSAGE_DELETE'), this.translate.instant('QUIZZES.TOAST.ERROR'), {
        timeOut: 5000,
        positionClass: 'toast-top-center'
      });
    });
  }
}
