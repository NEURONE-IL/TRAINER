import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, animate, style } from '@angular/animations'

@Component({
  selector: 'app-quiz-mantainer-component',
  templateUrl: './quiz-mantainer.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./quiz-mantainer.component.css']
})
export class QuizMantainerComponent {
 verQuizes=true;
 crearQuizToogle(){
    this.verQuizes= !this.verQuizes;
 }
 

}
