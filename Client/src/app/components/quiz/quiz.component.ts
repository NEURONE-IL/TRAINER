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
    for (let i = 0; i < answers.length; i++){
      const answer = (answers[i] as HTMLInputElement);
      if (answer.type === 'text' || answer.type === 'textarea'){
        if (answer.value.length > 0){
          const string = answer.name.split('_');
          const bonus = this.getAnswerBonus(string[1]);
          this.saveAnswer(string[1], answer.value, bonus);
          console.log(string[1], ';', answer.value, ';', bonus, ';');
        }
      }
      else if (answer.type == 'radio'){
        if (answer.checked){
          const string = answer.name.split('_');
          const bonus = this.getAnswerBonus(string[1]);
          this.saveAnswer(string[1], answer.value, bonus);
          console.log(string[1], ';', answer.value, ';', bonus, ';');
        }
      }
      else if (answer.type == 'checkbox'){
        if (answer.checked){
          const alt = this.getAlternatives(answer.name);
          const string = answer.name.split('_');
          const bonus = this.getAnswerBonus(string[1]);
          this.saveAnswer(string[1], alt, bonus);
          console.log(string[1], ';', alt, ';', bonus, ';');
        }
      }
    }
  }

  saveAnswer(question, answer, bonus){
    console.log('quiz component ts');
    const jsonAnswer = {questionId: question, answerQuestion: answer, answerBonus: bonus};
    this.quizService.saveAnswer(jsonAnswer).subscribe((res) => {
      console.log(res);
    });
  }
}
/**
 * ¿Y ahora que?
 *  First timer en vista para saber cuanto tiempo estuvieron
 *  Setear todo al inicio del video (velocidad, volumen, etc) antes de empezar a tomar datos
 *  Hacer modelo de datos y conectar a la bdd
 *  Una vez echo lo anterior, hacer lo mismo para las acciones del video
 *  Crear acciones para quiz
 *  Hacer lo mismo con la bdd para acciones quiz
 *  Recrear string en respuestas para luego poder editar
 *  La funcion para recuperar datos del form debe soportar: agregar new y modificar respuesta anterior
 */

