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
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-quiz-mantainer-component',

  templateUrl: './quiz-mantainer.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./quiz-mantainer.component.css']
})

export class QuizMantainerComponent implements OnInit{
  verQuizes = true;
  crearQuiz=false;
  quizzes;
  pregunta="text";
  video;
  videos=[];
  constructor(private quizService: QuizService,
              public matDialog: MatDialog,
              private http: HttpClient,
              private toastr: ToastrService,
              private translate: TranslateService,
              private router: Router) {  }

 ngOnInit(): void{
  this.loadQuizes();
  this.loadVideos();
 }

 loadQuizes(){
  this.quizService.getQuizzes().subscribe(res => {
    this.quizzes = res.data.reverse();
    console.log(this.quizzes)

  });
 }

 loadVideos(){
  this.quizService.getVideos().subscribe(
    (res)=>{
      this.videos=[];
      for (let i in res.data){
        this.videos.push({
          name: res.data[i].name,
          language: res.data[i].language,
          _id: res.data[i]._id, 
          video_url: res.data[i].video_url,
          image_url: res.data[i].image_url,
        })
        console.log(this.videos)
      }
    })
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
      this.quizService.getQuizzes().subscribe(res => this.quizzes = res.data.reverse);
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

  ejercicios=[];
  ejercicio= this.ejercicios.length+1;
  calcularCodigoTresDigitos(numero){
    let codigo= ((numero -(((numero-numero%10)%100))-numero%10)/100).toString()+(((numero-numero%10)%100)/10).toString()+(numero%10).toString();
    return codigo;
  }

  /* PARA GENERAR LAS PREGUNTAS */
  quizId;
  justificacion = false;
  questions=[];
  file: File;
  editingQuestion= -1;
  videoSelected;

  guardarPregunta(tipo){
    /* leer datos desde el formulario */
    let pregunta= (document.getElementById("pregunta")  as HTMLInputElement).value;
    let justifique;
    if(this.justificacion && this.editingQuestion<0){
      justifique= (document.getElementById("justifique")  as HTMLInputElement).value;
    }
    this.file = this.questionImage;
    let questionCode= this.calcularCodigoTresDigitos(this.questions.length+1);
    //
    //RESOURCE
    //

    let resourceCode= this.calcularCodigoTresDigitos(this.quizId)+ this.calcularCodigoTresDigitos(this.ejercicio)+ this.calcularCodigoTresDigitos(this.questions.length+1);


    /*Si se esta editando editar los campos */
    if(this.editingQuestion>=0){
      this.questions[this.editingQuestion].question=pregunta;
      if("bonus" in this.questions[this.editingQuestion]){
        this.justificacion=true;
        this.questions[this.editingQuestion].bonus=justifique;
      }
      this.questions[this.editingQuestion].resource_url=this.file;
      this.editingQuestion=-1;
    }else{
      let question;
      /* generar pregunta */
      if(tipo=="text"){
        question={
          "question_num": this.questions.length+1,
          "question_type": 1 ,
          "question_id": questionCode, //Falta concatenar con el del quiz y el del ejercicio.
          "question": pregunta,
          "resource_url":this.file,//esto es el elemento file, no se como se procesa rly.
        }
      }

      if(tipo=="simple" ){
        question={
          "question_num": this.questions.length+1,
          "question_type": 2 ,
          "question_id": questionCode, //Falta concatenar con el del quiz y el del ejercicio.
          "question": pregunta,
          "alternatives":this.alternatives,
          "resource_url":this.file,//esto es el elemento file, no se como se procesa rly.
        }
        this.alternatives=[];
      }

      if(tipo=="multy"){
        question={
          "question_num": this.questions.length+1,
          "question_type": 3 ,
          "question_id": questionCode, //Falta concatenar con el del quiz y el del ejercicio.
          "question": pregunta,
          "alternatives":this.alternatives,
          "resource_url":this.file,//esto es el elemento file, no se como se procesa rly.
        }
        this.alternatives=[];
      }

      if(this.justificacion){
        question["bonus"]=justifique;
      }
      /*agregar a las preguntas */
      this.questions.push(question);
    }

    this.cleanForm();
    console.log(this.questions);

  }

  textAlternatives(alternatives){
    console.log(alternatives);
    let text="";
    for (let alternative of alternatives){
              text=text + alternative.alternative_num +": "+alternative.alternative_text + "  -  "
            }
    return text;
  }

  editQuestion(i){
    //Obtiene la pregunta:
    (document.getElementById("pregunta")  as HTMLInputElement).value= this.questions[i].question;

    //Obtiene el bonus
    if("bonus" in this.questions[i]){
      console.log("found the thing!");
      console.log(this.questions[i]);
      (document.getElementById("justificacion")  as HTMLInputElement).checked=this.questions[i].bonus;
      this.justificacion=true;
      setTimeout(
        ()=>{(document.getElementById("justifique")  as HTMLInputElement).value = this.questions[i].bonus;}
        ,100)
    }

    //Obtiene las alternatives:
    if(this.questions[i].question_type==2 || this.questions[i].question_type==3){
      console.log("pregunta de alternativas");

      this.alternatives= Object.assign([], this.questions[i].alternatives);
      if(this.questions[i].question_type==2){
        this.pregunta= "simple"
      }
      if(this.questions[i].question_type==3){
        this.pregunta= "multy"
      }
    }

    //Obtiene la file
    (document.getElementById("file")  as HTMLInputElement).value= "";
    this.questionImage=this.questions[i].resource_url;
    this.editingQuestion= i;
  }

  cleanForm(){
    (document.getElementById("pregunta")  as HTMLInputElement).value= "";
    (document.getElementById("justificacion")  as HTMLInputElement).checked=false;

    if(this.justificacion){
      this.justificacion=false;
      (document.getElementById("justifique")  as HTMLInputElement).value="";
    }

    (document.getElementById("file")  as HTMLInputElement).value= "";
    this.questionImage=null;

    if(this.pregunta=="multy"){
      this.pregunta= "text";
      (document.getElementById("alternativa")  as HTMLInputElement).value= "";
      (document.getElementById("alternativaCorrecta")  as HTMLInputElement).checked=false;
    }

    //this.toggleExercise(false);
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

  setJustifique(){
    console.log("nani?!");
    this.justificacion= (document.getElementById("justificacion")  as HTMLInputElement).checked;
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


/* PARA GENERAR EJERCICIOS */

clearEjercicio(){
  (document.getElementById("titleEx")  as HTMLInputElement).value="";
  (document.getElementById("fileEx")  as HTMLInputElement).value="";
  this.exerciseImage = null;
  (document.getElementById("descEx")  as HTMLInputElement).value="";
  this.cleanForm();
  this.alternatives=[];
  this.questions=[];
  this.justificacion = false;
  this.file=null;
  this.editingQuestion= -1;
}

cancelarEjercicio(){
  this.clearEjercicio();
  this.mostrarPanelEjercicio=false;
  this.editingExercise=-1;
}

crearEjercicio(){
  let titulo= (document.getElementById("titleEx")  as HTMLInputElement).value;
  let file = this.exerciseImage;
  let descripcion= (document.getElementById("descEx")  as HTMLInputElement).value;
  let id= this.ejercicios.length+1;
  let ejercicio={
    "exercise_id": this.calcularCodigoTresDigitos(id),
    "introduction": descripcion,
    "title": titulo,
    "questions": this.questions,
    "resource_url":file,
  }
  if(this.editingExercise>=0){
    this.ejercicios[this.editingExercise]=ejercicio;
  }else{
    this.ejercicios.push(ejercicio);
  }

  this.clearEjercicio();
  console.log(this.ejercicios);
  this.toggleExercise(false);
}

mostrarPanelEjercicio=false;
agregarEjercicio(){
  this.mostrarPanelEjercicio=true;
}

editingExercise=-1;
editExercise(i){
  this.toggleExercise(true);
  setTimeout(()=>{
    (document.getElementById("titleEx")  as HTMLInputElement).value=this.ejercicios[i].title;
  (document.getElementById("fileEx")  as HTMLInputElement).value= "";
  this.exerciseImage=this.ejercicios[i].resource_url;

  (document.getElementById("descEx")  as HTMLInputElement).value=this.ejercicios[i].introduction;
  this.cleanForm;
  this.alternatives=[];
  this.questions=Object.assign([], this.ejercicios[i].questions);
  this.justificacion = false;
  this.file=null;
  this.editingQuestion= -1;
  this.editingExercise=i;
  }, 100);
  }

deleteExercise(i){
  this.ejercicios.splice(i,i);
    if(i==0){
      this.ejercicios.splice(0,1);
    }
    for(let k=0; k< this.ejercicios.length; k++){
      this.ejercicios[k].exercise_id=this.calcularCodigoTresDigitos(k+1) ;

    }
}

/* GUARDAR QUIZ */


quizCreate(){
  console.log(this.quizzes.length);
  if(this.quizzes && this.quizzes!= NaN ){
    this.quizId=this.quizzes.length+1;
  }else{
    this.quizId=1;
  }

}

editingQuiz= false;

cancelarQuiz(){
  this.clearQuiz;
  this.verQuizes=true;
}
quizImage=null;
exerciseImage=null;
clearQuiz(){
  (document.getElementById("titleQuiz")  as HTMLInputElement).value="";
  (document.getElementById("fileQuiz")  as HTMLInputElement).value=null;
  (document.getElementById("descQuiz")  as HTMLInputElement).value="";
  this.quizImage=null;
  let id= this.quizId;
  let video=null;
  if(this.mostrarPanelEjercicio){
    this.clearEjercicio();
  }

  this.editingQuiz=false;
  this.ejercicios=[];
}


guardarQuiz(){
  let titulo= (document.getElementById("titleQuiz")  as HTMLInputElement).value;
  let file = this.quizImage;
  let descripcion= (document.getElementById("descQuiz")  as HTMLInputElement).value;
  let id= this.quizId;
  let video_id= this.videoSelected;
  let quiz =null;
  if(this.editingQuiz){
    quiz={
      "quiz_id":this.quizId,
      "video_id": video_id,
      "name": titulo,
      "instructions": descripcion,
      "description": descripcion,
      "exercises": this.ejercicios,
      "resource_url":file,
    }
  }else{
    quiz={
      "video_id": video_id,
      "quiz_id": this.calcularCodigoTresDigitos(id),
      "name": titulo,
      "instructions": descripcion,
      "description": descripcion,
      "exercises": this.ejercicios,
      "resource_url":file,
    }
  }

  //NOT SURE ABOUT THIS
  //editando

  //GUARDAR EN BD
  console.log(quiz);
  this.saveQuiz(quiz);
  this.clearQuiz();
}


//
//FALTA
//

//Al cargar los quizzes se carga un array de quizzes?
saveQuiz(quiz){
  return this.quizService.addQuiz(quiz).subscribe(res => {
    this.loadQuizes();
    this.crearQuizToogle();
  });
}




//VALIDACIONES
validateFormQuestion(){
  return;
}

validateFormExercise(){
  return;
}

validateFormQuiz(){
  return;
}



//videos 
verVideos= false;
videosToggle(){
  this.verVideos= !this.verVideos;
  if(this.verVideos){
    console.log(this.videos); //mostrar los videos
    this.crearQuiz=false;
    this.verQuizes=false;
  }
}


loadImage(file){
  let formData = new FormData();
  formData.append('file', file);
  this.quizService.saveImage(formData).subscribe(
    (res)=>{
      console.log(res)
    }
  )
  return;
}
languageVideo="es";

loadImageQuiz(){
  console.log("we have it! :D")
  let formData = new FormData();
  let file = (document.getElementById("fileQuiz")  as HTMLInputElement).files[0];
  formData.append('file', file);
  this.quizService.saveImage(formData).subscribe(
    (res:any)=>{
       this.quizImage=res.url;
    }
  )
}

loadImageExcersise(){
  console.log("we have it! :O")
  let formData = new FormData();
  let file = (document.getElementById("fileEx")  as HTMLInputElement).files[0];
  formData.append('file', file);
  this.quizService.saveImage(formData).subscribe(
    (res:any)=>{
       this.exerciseImage=res.url;
    }
  )
}
questionImage= null;
questionImageChange(){
  console.log("we have it! :O")
  let formData = new FormData();
  let file = (document.getElementById("file")  as HTMLInputElement).files[0];
  formData.append('file', file);
  this.quizService.saveImage(formData).subscribe(
    (res:any)=>{
       this.questionImage=res.url;
    }
  )
}
showExercises=false;
toggleExercise(value){
  this.showExercises= value;
}

editQuiz(quiz){
  this.crearQuizToogle();
  this.editingQuiz=true;
  console.log(quiz);
  setTimeout(()=>{
    //Asignar Valores
    (document.getElementById("titleQuiz")  as HTMLInputElement).value= quiz.name;
    this.quizImage=quiz.resource_url;
    (document.getElementById("descQuiz")  as HTMLInputElement).value= quiz.instructions;
    this.quizId=quiz._id;
    this.videoSelected= quiz.video_id;
    this.ejercicios= quiz.exercises;
  }, 10)
  
}

}
