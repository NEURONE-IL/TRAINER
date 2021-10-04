import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {QuizService} from '../../services/videoModule/quiz.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  encapsulation: ViewEncapsulation.Emulated, // ??
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  @Input() quizNumber: number;
  @Output() newItemEvent = new EventEmitter<string>();

  quiz;
  exerciseActual;
  last;
  global = 0;

  constructor(private quizService: QuizService,
              private route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.getQuiz();
    this.exerciseActual = 0;
  }

  getQuiz() {
    this.quiz = this.quizService.getQuiz();
  }

  sendQuizResponse(value) {
    this.newItemEvent.emit(value);
  }

  increaseExercise(lastExercise){
    this.saveAnswer();
    if (!lastExercise) {
      this.exerciseActual++;
    }
    this.global = 0;
  }

  decreaseExercise(firstExercise) {
    this.saveAnswer();
    if (!firstExercise){
      this.exerciseActual--;
    }
    this.global = 0;
  }

  sendQuiz() {
    this.saveAnswer();
    this.exerciseActual = -1;
  }

  resourceExist(url){
    var img = new Image();
    img.src = '/assets/videoModule-images/' + url + '.png';
    return img.height !== 0;
  }

  getAnswerBonus(name: string){
    const new_name = 'answer_bonus' + name;
    const answer = (document.getElementsByName(new_name)[0] as HTMLInputElement);
    return (answer.value);
  }

  getAlternatives(name: string){
    const alternatives = document.getElementsByName(name);
    let value = '';
    for (let i = 0; i < alternatives.length; i++){
      const alternative = (alternatives[i] as HTMLInputElement);
      if (alternative.checked){
        value += alternative.value + '/';
      }
    }
    return value;
  }

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
    return finalAnswers;
  }

  saveAnswer(){
    let respuestas = this.getAnswers();
    let index = 0;
    let json = [];
    let j = {};
    for (let valor of respuestas){
      if (index == 4){
        index = 0
        this.quizService.getAnswer(j["questionId"]).subscribe((res) => {
          console.log(res.data);
          if (res.data == null){
            this.quizService.saveAnswer(j).subscribe((res) => { })
          }
          else{
            this.quizService.updateAnswer(j,j["questionId"]).subscribe((res) => { })
          }
        });
        j = {};

      }

      if (index == 0){
        j["questionId"] = valor;
      }
      else if (index == 1){
        j["questionType"] = valor;
      }
      else if (index == 2){
        j["answerQuestion"] = valor;
      }
      else {
        j["answerBonus"] = valor;
      }
      index++;
    }
    if (respuestas.length > 0){
    this.quizService.getAnswer(j["questionId"]).subscribe((res) => {
        console.log(res.data);
        if (res.data == null){

          this.quizService.saveAnswer(j).subscribe((res) => { })
        }
        else{
          this.quizService.updateAnswer(j,j["questionId"]).subscribe((res) => { })
        }

      });
    }
  }

  /*
  **  Cuando apace un nuevo ejercicio, esta funcion revisa en la base de datos si hay alguna respuesta
  **  y la muestra al usuario.
  **  RECORDAD: añadir flujo y stage para asegurar usuario
  **/
  ngAfterViewChecked(){
    if (this.global == 0) {
      let ids = [];
      const answers = document.getElementsByClassName('answer');
      for (let i = 0; i < answers.length; i++) {
        const answer = (answers[i] as HTMLInputElement);
        const string = answer.name.split('_');
        let yaEsta = false;
        for (let id of ids) {
          if (id == string[1]) {
            yaEsta = true;
            break;
          }
        }
        if (!yaEsta) {
          ids.push(string[1])
        }
      }
      if (ids.length != 0){
        this.global = 1;
      }


      /* Aqui fro sobre los ids para obtener respuestas*/
      for (let id of ids) {
        this.quizService.getAnswer(id).subscribe((res) => {
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
              if (res.data.questionType == 'checkbox'){
                let ans = res.data.answerQuestion;
                let string = ans.split("[");
                for (let alt of string){
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
