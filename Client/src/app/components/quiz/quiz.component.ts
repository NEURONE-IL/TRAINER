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

  constructor(private quizService: QuizService,
              private route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.getQuiz();
    this.exerciseActual = 0;
  }

  getQuiz() {
    this.quiz = this.quizService.getQuiz();
    // console.log(this.quiz);
  }

  sendQuizResponse(value) {
    this.newItemEvent.emit(value);
  }

  increaseExercise(lastExercise) {
    if (!lastExercise) {
      this.exerciseActual++;
    }
  }

  decreaseExercise(firstExercise) {
    if (!firstExercise){
      this.exerciseActual--;
    }
  }

  sendQuiz() {
    console.log('Enviando quiz jeje');
  }

  editExercise() {
    console.log('Editar el ejercicio ' + this.exerciseActual);
  }

  saveExercise() {
    console.log('Guardar el ejercicio');
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

  updateAnswer(){
    let respuestas = this.getAnswers();
    let index = 0;
    let json = [];
    let j = {};
    for (let valor of respuestas){
      if (index == 4){
        index = 0;
        this.quizService.updateAnswer(j, j["questionId"]).subscribe((res) => { });
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
    this.quizService.updateAnswer(j, j["questionId"]).subscribe((res) => { });
  }

  getValue(questionId){
    console.log("onload...");
    this.quizService.getAnswer(questionId).subscribe((res) => {
      console.log("Respuesta: ")
      console.log(res.data);
    });
  }

}
