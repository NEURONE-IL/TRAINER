import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ApiTriviaService } from '../../services/apiTrivia/apiTrivia.service';
import { ApiSGService } from '../../services/apiSG/apiSG.service';


@Component({
  selector: 'app-config',
  templateUrl: './apiConfiguration.component.html',
  styleUrls: ['./apiConfiguration.component.css']
})
export class ApiConfigurationComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService,
              private triviaService: ApiTriviaService,
              private apiSGService: ApiSGService) { }

  ngOnInit(): void {
  }
  getApiKey(){
    this.triviaService.getApiKey();
  }
  getApiKeySG(){
    this.apiSGService.getApiKey();
  }

}

