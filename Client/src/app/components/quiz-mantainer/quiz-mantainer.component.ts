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
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-quiz-mantainer-component',

  templateUrl: './quiz-mantainer.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./quiz-mantainer.component.css']
})

export class QuizMantainerComponent implements OnInit{
 verQuizes = true;
 quizzes;
 pregunta="text";
 video;

  constructor(private quizService: QuizService,
              public matDialog: MatDialog,
              private http: HttpClient,
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


  ejercicio= 21;
  calcularCodigoTresDigitos(numero){
    let codigo= ((numero -(((numero-numero%10)%100))-numero%10)/100).toString()+(((numero-numero%10)%100)/10).toString()+(numero%10).toString();
    return codigo;
  }

  /* PARA GENERAR LAS PREGUNTAS */
  questions=[];
  file: File;
  editingQuestion= -1;
  guardarPregunta(tipo){
    /* leer datos desde el formulario */
    let pregunta= (document.getElementById("pregunta")  as HTMLInputElement).value;
    let justifique= (document.getElementById("justificacion")  as HTMLInputElement).checked;
    this.file = (document.getElementById("file")  as HTMLInputElement).files[0];
    let exerciseCode= this.calcularCodigoTresDigitos(this.ejercicio);

   

    /*Si se esta editando editar los campos */
    if(this.editingQuestion>=0){
      this.questions[this.editingQuestion].question=pregunta;
      this.questions[this.editingQuestion].bonus=justifique;
      this.questions[this.editingQuestion].resource_url=this.file;
    }else{
      let question;
      /* generar pregunta */
      if(tipo=="text"){
        question={
          "question_num": this.questions.length+1,
          "question_type": 1 ,
          "question_id": exerciseCode, //Falta concatenar con el del quiz y el del ejercicio. 
          "question": pregunta,
          "bonus": justifique, 
          "resource_url":this.file,//esto es el elemento file, no se como se procesa rly. 
        }
      }
      
      if(tipo=="multy" || tipo=="simple" ){
        question={
          "question_num": this.questions.length+1,
          "question_type": 3 ,
          "question_id": exerciseCode, //Falta concatenar con el del quiz y el del ejercicio. 
          "question": pregunta,
          "alternatives":this.alternatives,
          "bonus": justifique, 
          "resource_url":this.file,//esto es el elemento file, no se como se procesa rly. 
        }
        this.alternatives=[];
      }

      /*agregar a las preguntas */
      this.questions.push(question);
    }

    this.cleanForm();
    console.log(this.questions);
    
  }
  
  editQuestion(i){
    (document.getElementById("pregunta")  as HTMLInputElement).value= this.questions[i].question;
    (document.getElementById("justificacion")  as HTMLInputElement).checked=this.questions[i].bonus;
    (document.getElementById("file")  as HTMLInputElement).value= "";
    this.editingQuestion= i;
  }

  cleanForm(){
    (document.getElementById("pregunta")  as HTMLInputElement).value= "";
    (document.getElementById("justificacion")  as HTMLInputElement).checked=false;
    (document.getElementById("file")  as HTMLInputElement).value= "";

    if(this.pregunta=="multy"){
      this.pregunta= "text";
      (document.getElementById("alternativa")  as HTMLInputElement).value= "";
      (document.getElementById("alternativaCorrecta")  as HTMLInputElement).checked=false;
    }
  }
  deleteQuestion(i){
    this.questions.splice(i,i);
    if(i==0){
      this.questions.splice(0,1);
    }
    for(let k=0; k< this.questions.length; k++){
      this.questions[k].question_num=k+1;
    }
    
  }



  /* PROCESAR ALTERNATIVAS */
  alternatives=[];

  deleteAlternative(i){
    this.alternatives.splice(i,i);
    if(i==0){
      this.alternatives.splice(0,1);
    }
    for(let k=0; k< this.alternatives.length; k++){
      this.alternatives[k].alternative_num=k+1;
      
    }
  }

  addAlternative(){
    let opcion= (document.getElementById("alternativa")  as HTMLInputElement).value;
    let numero= this.alternatives.length+1;
    let correcta= false;
    if(this.pregunta=="multy"){
      correcta= (document.getElementById("alternativaCorrecta")  as HTMLInputElement).checked;
    }
    
    let alternativa={
      "alternative_num": numero, 
      "alternative_text":opcion,
      "alternative_right": correcta
    }

    this.alternatives.push(alternativa);
    (document.getElementById("alternativa")  as HTMLInputElement).value= "";
    if(this.pregunta=="multy"){
    ((document.getElementById("alternativaCorrecta")  as HTMLInputElement).checked)=false;}
  }

  //ALTERNATIVAS SIMPLES

  addAlternativeSimple(){
    let opcion= (document.getElementById("alternativa")  as HTMLInputElement).value;
    let numero= this.alternatives.length+1;
    let correcta= (document.getElementById("alternativaCorrecta")  as HTMLInputElement).checked;
    let alternativa={
      "alternative_num": numero, 
      "alternative_text":opcion,
      "alternative_right": false
    }

    this.alternatives.push(alternativa);
    (document.getElementById("alternativa")  as HTMLInputElement).value= "";
    ((document.getElementById("alternativaCorrecta")  as HTMLInputElement).checked)=false;
  }

  markCorrect(i){
    this.alternatives[i].alternative_right=true;
    for(let k=0; k< this.alternatives.length; k++){
      if(k!=i){
        this.alternatives[k].alternative_right=false;
      }
    }
  }

}
