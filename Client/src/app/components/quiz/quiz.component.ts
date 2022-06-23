import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {QuizService} from '../../services/videoModule/quiz.service';
import {ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import {StageService} from '../../services/trainer/stage.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  @Input() quizNumber: number;
  @Input() saveUserData: string;

  /*
  * quiz -> guarda el quiz
  * exerciseActual -> guarda el numero del ejercicio actual
  * last -> guarda el numero del ultimo ejercicio
  * global -> maneja la funcion ngAfterViewChecked (para que se ejecute una sola vez al iniciar la vista)
  * */
  quiz;
  exerciseActual;
  last;
  global = 0;

  stageId;
  userId;
  flowId;

  constructor(private quizService: QuizService,
              private router: Router,
              private authService: AuthService,
              private route: ActivatedRoute,
              private stageService: StageService) {  }

  ngOnInit(): void {
    let user = this.authService.getUser();
    this.quizService.getQuizzesByUser(user._id).subscribe(res => {
      this.quiz = res['quizzes'];
    });
    this.exerciseActual = 0;

    this.stageId = localStorage.getItem('stageId', );
    this.userId = JSON.parse(localStorage.getItem('currentUser', ))._id;
    this.stageService.getStage(this.stageId).subscribe(res => {
      this.flowId = res['stage'].flow;
    });
  }

  eventAnswers(questionId, alternativa, numAlternative, questionType){
    let value = '';
    if ( questionType === 'checkbox' ){
      const isSelected = document.getElementById('answer_' + questionId + '_alt_' + numAlternative) as HTMLInputElement;
      if ( isSelected.checked ){
        value = 'Evento: Usuario seleccionò alternativa ' + numAlternative + ': ' + alternativa;
      }
      else{
        value = 'Evento: Usuario deseleccionò alternativa ' + numAlternative + ': ' + alternativa;
      }
    }
    else if ( questionType === 'radio' ){
      value = 'Evento: Usuario seleccionò alternativa ' + numAlternative + ': ' + alternativa;
    }
    else if ( questionType === 'textarea' ){
      value = 'Evento: Usuario escribio: ' + alternativa;
    }
    else{
      value = 'Evento: Usuario escribio en bonus: ' + alternativa;
    }
    const finalEvent = 'Pregunta: ' + questionId + ' Tipo: ' + questionType + ' ' + value;

    if (this.saveUserData === 'Yes') {
      this.quizService.handleEvent(finalEvent, 'quiz', this.userId, this.stageId, this.flowId).subscribe((res) => { });
    }
  }

  inputTextArea(questionId, questionType){
    let answer;

    if ( questionType === 'textarea' ){
      answer = document.getElementsByName('answer_' + questionId)[0];
    }
    else if ( questionType === 'text' ){
      answer = document.getElementsByName('answer_bonus' + questionId)[0];
    }

    const value = answer.value;
    this.eventAnswers(questionId, value, 0, questionType);
  }

  increaseExercise(lastExercise){
    if (this.saveUserData === 'Yes'){
      this.saveAnswer();
    }

    if (!lastExercise) {
      this.exerciseActual++;
    }

    this.global = 0;
  }

  decreaseExercise(firstExercise) {
    if (this.saveUserData === 'Yes'){
      this.saveAnswer();
    }

    if (!firstExercise){
      this.exerciseActual--;
    }

    this.global = 0;
  }

  sendQuiz() {
    if (this.saveUserData === 'Yes'){
      this.saveAnswer();
      this.router.navigate(['/home']);
    }
    this.exerciseActual = -1;
  }

  resourceExist(questionId){
    const img = new Image();
    img.src = '/assets/videoModule-images/' + questionId + '.png';
    return img.height !== 0;
  }

  /*
  * Retorna la respuesta del bonus de una pregunta questionId
  * */
  getAnswerBonus(questionId: string){
    const newId = 'answer_bonus' + questionId;
    const answer = (document.getElementsByName(newId)[0] as HTMLInputElement);
    return (answer.value);
  }

  /*
  * Retorna las respuestas de una pregunta questionId de alternativas multiples
  * */
  getAlternatives(questionId: string){
    const alternatives = document.getElementsByName(questionId);
    let value = '';
    for (let i = 0; i < alternatives.length; i++){
      const alternative = (alternatives[i] as HTMLInputElement);
      if (alternative.checked){
        value += alternative.value + '/';
      }
    }
    return value;
  }

  /*
  * Obtiene las respuestas de la vista actual y las retorna como un arreglo
  * */
  getAnswers(){
    const answers = document.getElementsByClassName('answer');
    let finalAnswers = [];
    for (let i = 0; i < answers.length; i++){
      const answer = (answers[i] as HTMLInputElement);
      if (answer.type === 'text' || answer.type === 'textarea'){
        if (answer.value.length > 0){
          const string = answer.name.split('_');
          const bonus = this.getAnswerBonus(string[1]);
          let a = string[1]+';'+answer.type+';'+answer.value+';'+bonus;
          finalAnswers.push(string[1],answer.type,answer.value,bonus);
        }
      }
      else if (answer.type == 'radio'){
        if (answer.checked){
          const string = answer.name.split('_');
          const bonus = this.getAnswerBonus(string[1]);
          let a = string[1]+';'+answer.type+';'+answer.value+';'+bonus;
          finalAnswers.push(string[1],answer.type,answer.value,bonus);
        }
      }
      else if (answer.type == 'checkbox'){
        if (answer.checked){
          const alt = this.getAlternatives(answer.name);
          const string = answer.name.split('_');
          const bonus = this.getAnswerBonus(string[1]);
          let yaEsta = false;
          for (let ans of finalAnswers){
            if (string[1] === ans){
              yaEsta = true;
              break;
            }
          }
          if (!yaEsta){
            finalAnswers.push(string[1],answer.type,alt,bonus);
          }

        }
      }
    }
    //console.log("     FINAL ANSWERS: ", finalAnswers);
    return finalAnswers;
  }

  /*
  * Obtiene la respuesta, si existe se actualiza la bdd, en caso contrario se guarda.
  * */
  getAnswerExist(questionId, answer){
    if ( answer === '' || answer == null){
      return;
    }

    this.quizService.getAnswer(questionId, this.userId, this.stageId, this.flowId).subscribe((res) => {
      if (res.data == null){
        this.quizService.saveAnswer(answer, this.userId, this.stageId, this.flowId).subscribe((res) => { })
      }
      else{
        this.quizService.updateAnswer(answer, questionId, this.userId, this.stageId, this.flowId).subscribe((res) => { })
      }

    });
  }

  /*
  * Guarda las respuestas en la base de datos.
  * */
  saveAnswer(){
    let respuestas = this.getAnswers();
    let index = 0;
    let json = [];
    let j = {};
    for (let valor of respuestas){
      if (index === 4){
        index = 0
        this.getAnswerExist(j["questionId"], j);
        j = {};

      }

      if (index === 0){
        j["questionId"] = valor;
      }
      else if (index === 1){
        j["questionType"] = valor;
      }
      else if (index === 2){
        j["answerQuestion"] = valor;
      }
      else {
        j["answerBonus"] = valor;
      }
      index++;
    }
    if (respuestas.length > 0){
      this.getAnswerExist(j["questionId"], j);
    }
  }

  /*
  **  Cuando aparece un nuevo ejercicio, esta funcion revisa en la base de datos si hay alguna respuesta
  **  y la muestra al usuario.
  **/
  ngAfterViewChecked(){
    if (this.exerciseActual !== 0) {
      if (this.global === 0) {
        let ids = [];
        const answers = document.getElementsByClassName('answer');
        for (let i = 0; i < answers.length; i++) {
          const answer = (answers[i] as HTMLInputElement);
          const string = answer.name.split('_');
          let yaEsta = false;
          for (let id of ids) {
            if (id === string[1]) {
              yaEsta = true;
              break;
            }
          }
          if (!yaEsta) {
            ids.push(string[1]);
          }
        }
        if (ids.length !== 0) {
          this.global = 1;
        }


        /* Aqui for sobre los ids para obtener respuestas*/
        for (let id of ids) {
          this.quizService.getAnswer(id, this.userId, this.stageId, this.flowId).subscribe((res) => {
            if (res.data != null) {
              if (res.data.answerBonus != null) {
                let name = "answer_bonus" + res.data.questionId;
                let bonusElement = document.getElementsByName(name);
                const bonus = (bonusElement[0] as HTMLInputElement);
                if (bonus) {
                  bonus.value = res.data.answerBonus;
                }
              }
              if (res.data.answerQuestion != null) {
                if (res.data.questionType == 'textarea') {
                  let name = "answer_" + res.data.questionId;
                  let questionElement = document.getElementsByName(name);
                  const question = (questionElement[0] as HTMLInputElement);
                  if (question) {
                    question.value = res.data.answerBonus;
                  }
                }
                if (res.data.questionType == 'radio') {
                  let ans = res.data.answerQuestion;
                  let alt = ans[1];
                  let id = "answer_" + res.data.questionId + "_alt_" + alt;
                  let questionElement = document.getElementById(id);
                  const question = (questionElement as HTMLInputElement);
                  if (question) {
                    question.checked = true;
                  }
                }
                if (res.data.questionType == 'checkbox') {
                  let ans = res.data.answerQuestion;
                  let string = ans.split("[");
                  for (let alt of string) {
                    if (alt) {
                      let index = alt.charAt(0);
                      let id = "answer_" + res.data.questionId + "_alt_" + index;
                      let questionElement = document.getElementById(id);
                      const question = (questionElement as HTMLInputElement);
                      if (question) {
                        question.checked = true;
                      }
                    }
                  }
                }
              }
            }
          })
        }
      }
    }

  }


  updateProgress(percentage) {
    console.log('- Actualizar progreso -');
    console.log('UserId: ', this.userId);
    console.log('StageId: ', this.stageId);
    console.log('FlowId: ', this.flowId);
    // this.stageService.updateProgress(this.userId, this.flowId, this.stageId, percentage).subscribe(res => {});
  }

}
