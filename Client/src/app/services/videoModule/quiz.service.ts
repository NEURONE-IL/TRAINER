import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import questions from '../../../assets/static/quizQuestions.json'

export interface Quiz { }

@Injectable({
  providedIn: 'root'
})

export class QuizService {

  constructor( ) { }

  getQuestions() {
    return questions;
  }
}
