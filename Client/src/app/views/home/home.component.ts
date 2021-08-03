import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ApiTriviaService } from '../../services/apiTrivia/apiTrivia.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService,
              private triviaService: ApiTriviaService) { }

  estudios;
  estudioSeleccionado = '';
  apikey = this.triviaService.apiKey;

  ngOnInit(): void {
    this.getApiStudies();
  }
  getApiStudies(){
    this.triviaService.getStudies().subscribe((res: any) => {
      this.estudios = res.studys;
    });
  }

}

