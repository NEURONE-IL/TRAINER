import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Flow, FlowService } from 'src/app/services/trainer/flow.service';
import { SignupConstants } from '../signup/signup.constants';
import { getRegiones, getComunasByRegion } from 'dpacl';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
@Component({
  selector: 'app-user-creation-form',
  templateUrl: './user-creation-form.component.html',
  styleUrls: ['./user-creation-form.component.css'],
})
export class UserCreationFormComponent implements OnInit {
  userCreateForm: FormGroup;
  flows: Flow[] = [];
  years: number[] = [];
  courses: any;
  regions: any;
  selectedRegion: any;
  communes: any;
  region = new FormControl('', Validators.required);
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private flowService: FlowService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.courses = SignupConstants.courses;
    this.regions = getRegiones();
  }

  ngOnInit(): void {
    this.flowService.getFlows().subscribe(
      (response) => {
        this.flows = response['flows'];
        console.log(this.flows);
      },
      (err) => {
        this.toastr.error(
          this.translate.instant('FLOW.TOAST.NOT_LOADED_MULTIPLE_ERROR'),
          this.translate.instant('STAGE.TOAST.ERROR'),
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          }
        );
      }
    );
    //Hacer un for desde 1950 hasta el año actual que el array empiece en en año actual

    const hoy = new Date();
    this.years = new Array(hoy.getFullYear() - 1950)
      .fill(hoy.getFullYear())
      .map((x, i) => -i + x);

    this.userCreateForm = this.formBuilder.group({
      paramFlow: ['', Validators.required],
      paramEmailPrefix: ['', Validators.required],
      paramEmailSubfix: ['', Validators.required],
      paramName: ['', Validators.required],
      paramInstitution: ['', Validators.required],
      paramBirthdayYear: ['', Validators.required],
      paramCourse: ['', Validators.required],
      paramCommune: ['', Validators.required],
      paramRegion: ['', Validators.required],
      paramStart: ['', Validators.required],
      paramUsers: ['', Validators.required],
    });
  }

  onSubmit() {
    // tslint:disable-next-line:max-line-length
    this.authService.createMultipleUsers(this.userCreateForm).subscribe(
      (response) => {
        console.log(response);
      },
      (err) => {
        console.error(err);
        this.toastr.error('Ocurrió un error al crear los usuarios', 'Error', {
          timeOut: 5000,
          positionClass: 'toast-top-center',
        });
      }
    );
  }

  onRegionChange(regionChange: any) {
    this.communes = getComunasByRegion(regionChange.value);
    // this.studentFormControls.institution_commune.enable();
  }
}

export const passwordMatchValidator: ValidatorFn = (
  signupForm: FormGroup
): ValidationErrors | null => {
  if (
    signupForm.get('password').value ===
    signupForm.get('passwordConfirmation').value
  ) {
    return null;
  } else {
    return { passwordMismatch: true };
  }
};
