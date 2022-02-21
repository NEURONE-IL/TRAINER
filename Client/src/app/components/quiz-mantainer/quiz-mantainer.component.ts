import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { trigger, transition, animate, style } from '@angular/animations'

@Component({
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ],
  selector: 'app-quiz-mantainer-component',
  templateUrl: './quiz-mantainer.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./quiz-mantainer.component.css']
})
export class QuizMantainerComponent {

 visible= true;
 toggleDiv(){
   this.visible= !this.visible;
 }

}
