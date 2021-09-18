import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { QuizService } from '../../services/videoModule/quiz.service';

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

  constructor(private quizService: QuizService) {  }

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
    if(!lastExercise) {
      this.exerciseActual++;
    }
  }

  decreaseExercise(firstExercise) {
    if(!firstExercise){
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
    var path = '/assets/videoModule-images/'+url+'.png';
    img.src = path;
    return img.height != 0;
  }

  getAnswerBonus(name: string){
    const new_name = 'answer_bonus'+name;
    const answer = (<HTMLInputElement>document.getElementsByName(new_name)[0]);
    return (answer.value);
  }

  getAlternatives(name: string){
    const alternatives = document.getElementsByName(name);
    let value = '';
    for (let i=0; i<alternatives.length; i++){
      const alternative = (<HTMLInputElement>alternatives[i]);
      if (alternative.checked){
        value += alternative.value + '/';
      }
    }
    return value;
  }

  getAnswersString(){
    const answers = document.getElementsByClassName('answer');
    for (let i=0; i<answers.length; i++){
      const answer = (<HTMLInputElement>answers[i]);
      if (answer.type == 'text' || answer.type == 'textarea'){
        if (answer.value.length > 0){
          const string = answer.name.split("_");
          const bonus = this.getAnswerBonus(string[1]);
          console.log(string[1],';',answer.value,';',bonus,';');
        }
      }
      else if (answer.type == 'radio'){
        if (answer.checked){
          const string = answer.name.split("_");
          const bonus = this.getAnswerBonus(string[1]);
          console.log(string[1],';',answer.value,';',bonus,';');
        }
      }
      else if(answer.type == 'checkbox'){
        if (answer.checked){
          const alt = this.getAlternatives(answer.name);
          const string = answer.name.split("_");
          const bonus = this.getAnswerBonus(string[1]);
          console.log(string[1],';',alt,';',bonus,';');
        }
      }
    }
  }
}


