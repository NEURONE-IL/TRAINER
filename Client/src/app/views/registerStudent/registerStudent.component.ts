import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-home',
  templateUrl: './registerStudent.component.html',
  styleUrls: ['./registerStudent.component.css']
})

export class RegisterStudentComponent implements OnInit {

  signupForm: FormGroup;
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.required],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required]
    }, {validator: passwordMatchValidator});
  }

  /* Shorthands for form controls (used from within template) */
  get password() { return this.signupForm.get('password'); }
  get passwordConfirmation() { return this.signupForm.get('passwordConfirmation'); }

  /* Called on each input in either password field */
  onPasswordInput() {
    if (this.signupForm.hasError('passwordMismatch')) {
      this.passwordConfirmation.setErrors([{passwordMismatch: true}]);
    }
    else {
      this.passwordConfirmation.setErrors(null);
    }
  }
  onSubmit(){
    // tslint:disable-next-line:max-line-length
    this.authService.register(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.name, this.signupForm.value.lastName, 'admin');
  }
}

export const passwordMatchValidator: ValidatorFn = (signupForm: FormGroup): ValidationErrors | null => {
  if (signupForm.get('password').value === signupForm.get('passwordConfirmation').value) {
    return null;
  } else {
    return {passwordMismatch: true};
  }
};
