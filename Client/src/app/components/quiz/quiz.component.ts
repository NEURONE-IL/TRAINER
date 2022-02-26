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

  constructor(private quizService: QuizService,
              private route: ActivatedRoute) {  }

  /*
  * Se ejecuta al iniciar la vista.
  * Inicializa la variable del ejercicio actual en 0 y llama a la funcion para obtener el quiz que corresponde.
  * */
  ngOnInit(): void {
    this.quizService.getQuiz2(this.quizNumber).subscribe(res => {
      //this.quiz = res['data'];
      console.log(res['data']);
      console.log(res['data']['_id']);
    });
    this.quizService.getQuizzes().subscribe(res => {
      this.quiz = res['data'];
    });
    this.exerciseActual = 0;
  }

  /*
  * Maneja los eventos.
  * */
  eventAnswers(questionId, alternativa, numAlternative, questionType){
    let value = ""
    if ( questionType == 'checkbox' ){
      let estaSeleccionado = document.getElementById("answer_"+questionId+"_alt_"+numAlternative) as HTMLInputElement;
      if ( estaSeleccionado.checked ){
        value = 'Evento: Usuario seleccionò alternativa ' + numAlternative + ": " + alternativa;
      }
      else{
        value = "Evento: Usuario deseleccionò alternativa " + numAlternative + ": " + alternativa;
      }
    }
    else if ( questionType == 'radio' ){
      value = "Evento: Usuario seleccionò alternativa " + numAlternative + ": " + alternativa;
    }
    else if ( questionType == 'textarea' ){
      value = "Evento: Usuario escribio: " + alternativa;
    }
    else{
      value = "Evento: Usuario escribio en bonus: " + alternativa;
    }
    //console.log("Pregunta:", questionId, "Tipo:", questionType, value);
    let finalEvent = "Pregunta: " + questionId + " Tipo: " + questionType + " " + value;
    this.quizService.handleEvent(finalEvent, 'quiz').subscribe((res) => { });
  }

  /*
  * Maneja los eventos de texto
  * */
  inputTextArea(questionId, questionType){
    let answer
    let timeout

    if ( questionType == 'textarea' ){
      answer = document.getElementsByName("answer_"+questionId)[0];
    }
    else if ( questionType == 'text' ){
      answer = document.getElementsByName("answer_bonus"+questionId)[0];
    }

    let value = answer.value;
    this.eventAnswers(questionId, value, 0, questionType);
  }

  /*
  sendQuizResponse(value) {
    //console.log("FUNCTION: sendQuizResponse()");
    this.newItemEvent.emit(value);
  }*/

  /*
  * Incrementa la variable del ejercicio actual si es que no corresponde al ultimo ejercicio.
  * Guarda las respuestas del ejercicio actual antes de cambiar.
  * */
  increaseExercise(lastExercise){
    //console.log("FUNCTION: increaseExercise()");
    // Guardar ejercicio actual
    this.saveAnswer();

    // Incrementar ejercicio
    if (!lastExercise) {
      this.exerciseActual++;
    }

    this.global = 0;
  }

  /*
  * Decrementa la variable del ejercicio actual si es que no corresponde al primer ejercicio.
  * Guarda las respuestas del ejercicio actual antes de cambiar.
  * */
  decreaseExercise(firstExercise) {
    //console.log("FUNCTION: decreaseExercise()");
    // Guardar respuestas
    this.saveAnswer();

    // Decrementar ejercicio
    if (!firstExercise){
      this.exerciseActual--;
    }

    this.global = 0;
  }

  /*
  * Al presionar el usuario enviar respuestas.
  * Var ejercicio actual cambia a -1 para que en la vista aparezca una ventana de finalizacion del quiz.
  * */
  sendQuiz() {
    //console.log("FUNCTION: sendQuiz()");
    // Guardar respuestas del ejercicio actual.
    this.saveAnswer();

    // Cambiar variable ejercicio actual a -1.
    this.exerciseActual = -1;
  }

  /*
  * Retorna True si el recurso asociado a la pregunta questionId existe.
  * */
  resourceExist(questionId){
    //console.log("FUNCTION: resourceExist()");
    var img = new Image();
    img.src = '/assets/videoModule-images/' + questionId + '.png';
    return img.height !== 0;
  }

  /*
  * Retorna la respuesta del bonus de una pregunta questionId
  * */
  getAnswerBonus(questionId: string){
    //console.log("FUNCTION: getAnswerBonus()");
    const new_id = 'answer_bonus' + questionId;
    const answer = (document.getElementsByName(new_id)[0] as HTMLInputElement);
    return (answer.value);
  }

  /*
  * Retorna las respuestas de una pregunta questionId de alternativas multiples
  * */
  getAlternatives(questionId: string){
    //console.log("FUNCTION: getAlternatives()");
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
    //console.log("FUNCTION: getAnswers()");
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
    //console.log("LLAMANDO A FUNCION EXTERNA CON: ", questionId);
    if ( answer == "" || answer == null){
      return;
    }
    console.log(answer);
    this.quizService.getAnswer(questionId).subscribe((res) => {
      if (res.data == null){
      //  console.log("          GUARDAR");
        this.quizService.saveAnswer(answer).subscribe((res) => { })
      }
      else{
      //  console.log("          ACTUALIZAR");
      //  console.log("               ",answer)
        this.quizService.updateAnswer(answer,questionId).subscribe((res) => { })
      }

    });
  }

  /*
  * Guarda las respuestas en la base de datos.
  * */
  saveAnswer(){
  //  console.log("FUNCTION: saveAnswer()");
    let respuestas = this.getAnswers();
    //console.log("     RESPUESTAS: ", respuestas);
    let index = 0;
    let json = [];
    let j = {};
    for (let valor of respuestas){
      if (index == 4){
        index = 0
      //  console.log("       VALOR: ",j);
        this.getAnswerExist(j["questionId"], j);
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
    //  console.log("       VALOR: ",j);
      this.getAnswerExist(j["questionId"], j);
    }
  }

  /*
  **  Cuando aparece un nuevo ejercicio, esta funcion revisa en la base de datos si hay alguna respuesta
  **  y la muestra al usuario.
  **  RECORDAD: añadir flujo y stage para asegurar usuario
  **/
  ngAfterViewChecked(){
    if (this.exerciseActual != 0) {
    //  console.log("FUNCTION: ngAfterViewChecked()");
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
        if (ids.length != 0) {
          this.global = 1;
        }


        /* Aqui for sobre los ids para obtener respuestas*/
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

}
