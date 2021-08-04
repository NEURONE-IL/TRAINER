import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  encapsulation: ViewEncapsulation.None, // ??
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {

  constructor( ) { }

  ngOnInit(): void {
  }
}
