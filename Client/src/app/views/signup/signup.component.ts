import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlowService } from '../../services/trainer/flow.service';
import { AuthService } from '../../services/auth/auth.service';
import { SignupConstants } from './signup.constants';
import { getRegiones, getComunasByRegion } from 'dpacl';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  consentForm: FormGroup;
  tutorForm: FormGroup;
  studentForm: FormGroup;
  flow: any;
  validFlow = true;
  isLoadingFlow = true;

  courses: any;
  regions: any;
  selectedRegion: any;
  communes: any;

  userSubmitted = false;


  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private flowService: FlowService,
              private authService: AuthService,
              public router: Router,
              private toastr: ToastrService,
              private translate: TranslateService) {

    this.courses = SignupConstants.courses;
  }

  ngOnInit(): void {

//    this.checkFlow();
    this.regions = getRegiones();

    this.consentForm = this.formBuilder.group({
      consent: [false, Validators.requiredTrue]
    });
    this.tutorForm = this.formBuilder.group({
      tutor_names: ['', [Validators.required, Validators.minLength(3)]],
      tutor_last_names: ['', [Validators.required, Validators.minLength(3)]],
      relation: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.email, Validators.required]],
      emailConfirm: ['', [Validators.email, Validators.required]],
      tutor_phone: ['', [Validators.required, Validators.pattern("[0-9]{8,}")]]
    });
    this.studentForm = this.formBuilder.group({
      names: ['', [Validators.required, Validators.minLength(3)]],
      last_names: ['', [Validators.required, Validators.minLength(3)]],
      birthday: ['', Validators.required],
      course: ['', Validators.required],
      institution: ['', Validators.required],
      institution_commune: [{value: '', disabled: true}, Validators.required],
      institution_region: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d).{8,32}$/)]],
      password_confirmation: ['', [Validators.required, Validators.pattern(/^(?=.*\d).{8,32}$/)]]
    });
    console.log(!this.userSubmitted);
  }

  save() {
    let userData = Object.assign(this.tutorForm.value, this.studentForm.value);
    delete userData.password_confirmation;
    this.authService.signup(userData/*, this.route.snapshot.paramMap.get('flow_id')*/)
      .subscribe((res) => {
        this.userSubmitted = true;
      },
      (err) => {
        if(err.error.message === 'EMAIL_ALREADY_USED'){
          this.toastr.error(this.translate.instant("SIGNUP.FORM.ERROR.EMAIL_ALREADY_USED"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
            timeOut: 10000,
            positionClass: 'toast-top-center'
          })
        }else{
          this.toastr.error(this.translate.instant("SIGNUP.FORM.ERROR.GENERIC_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          })
        }
        console.log(err);
      });
  }

  /*
  checkFlow() {
    const flow_id = this.route.snapshot.paramMap.get('flow_id');
    this.flowService.getFlowSignup(flow_id).subscribe(
      response => {
        this.flow = response['flow'];
        this.isLoadingFlow=false;
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.NOT_LOADED_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.validFlow = false;
        this.isLoadingFlow = false;
      }
    );
  }*/

  onRegionChange(regionChange) {
    this.communes = getComunasByRegion(regionChange.value);
    this.studentFormControls.institution_commune.enable();
  }

  redirect(){
    this.router.navigate(['/login']);
  }

  get consentFormControls(): any {
    return this.consentForm['controls'];
  }

  get tutorFormControls(): any {
    return this.tutorForm['controls'];
  }

  get studentFormControls(): any {
    return this.studentForm['controls'];
  }

  hide= true;
}
