import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ApiTriviaService } from '../../services/apiTrivia/apiTrivia.service';
// imports ??????

@Component({
  selector: 'app-home', // ???
  templateUrl: './videoModule.component.html',
  styleUrls: ['./videoModule.component.css']
})
export class VideoModuleComponent implements OnInit {

  constructor() { } // Que deberia llevar? lo averiguaremos -> private formBuilder: FormBuilder, ...

  ngOnInit(): void {
  }
}
