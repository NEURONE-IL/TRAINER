import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Flow, FlowService } from 'src/app/services/trainer/flow.service';
import { SignupConstants } from '../signup/signup.constants';
import { getRegiones, getComunasByRegion } from 'dpacl';
import { DialogUsersPreviewComponent } from 'src/app/views/dialog-users-preview/dialog-users-preview.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/trainer-userUI/interfaces/user.interface';
import { environment } from 'src/environments/environment';
import FileSaver from 'file-saver';
@Component({
  selector: 'app-user-creation-form',
  templateUrl: './user-creation-form.component.html',
  styleUrls: ['./user-creation-form.component.css'],
})
export class UserCreationFormComponent implements OnInit {
  userCreateForm: FormGroup;
  user: User;
  loadingFiles: Boolean = true;
  loadingCreation: Boolean = false;
  flows: Flow[] = [];
  files: any[] = [];
  displayedColumns: string[] = ['nombre', 'fecha'];
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
    private translate: TranslateService,
    public matDialog: MatDialog
  ) {
    this.courses = SignupConstants.courses;
    this.regions = getRegiones();
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.flowService.getFlowsByUser(this.user._id).subscribe(
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
      paramEmailPrefix: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z0-9.-]+'),
        ],
      ],
      paramEmailSubfix: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern('[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]*'),
        ],
      ],
      paramName: ['', [Validators.required, Validators.maxLength(50)]],
      paramInstitution: ['', [Validators.required, Validators.maxLength(75)]],
      paramBirthdayYear: ['', Validators.required],
      paramCourse: ['', Validators.required],
      paramCommune: ['', Validators.required],
      paramRegion: ['', Validators.required],
      paramStart: ['', [Validators.required, Validators.min(1)]],
      paramUsers: [
        '',
        [Validators.required, Validators.min(1), Validators.max(50)],
      ],
    });
  }
  get userCreateFormControls(): any {
    return this.userCreateForm['controls'];
  }
  registerUsers() {
    // tslint:disable-next-line:max-line-length
    if (!this.userCreateForm.valid) {
      this.toastr.error('Revise los campos del formulario', 'Error', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
      });
      this.userCreateForm.markAllAsTouched();
      return;
    }
    let form = {
      paramAdminId: this.user._id,
      paramEmailPrefix: this.userCreateForm.value.paramEmailPrefix,
      paramEmailSubfix: this.userCreateForm.value.paramEmailSubfix,
      paramName: this.userCreateForm.value.paramName,
      paramInstitution: this.userCreateForm.value.paramInstitution,
      paramBirthdayYear: this.userCreateForm.value.paramBirthdayYear,
      paramCourse: this.userCreateForm.value.paramCourse,
      paramCommune: this.userCreateForm.value.paramCommune,
      paramRegion: this.userCreateForm.value.paramRegion,
      paramStart: this.userCreateForm.value.paramStart,
      paramUsers: this.userCreateForm.value.paramUsers,
    };

    this.loadingCreation = true;
    this.authService
      .createMultipleUsers(form, this.userCreateForm.value.paramFlow)
      .subscribe(
        (response) => {
          console.log(response);
          this.toastr.success(
            this.translate.instant('FLOW.TOAST.REGISTER_MULTIPLE_SUCCESS'),
            this.translate.instant(
              'FLOW.TOAST.REGISTER_MULTIPLE_SUCCESS_TITLE'
            ),
            {
              timeOut: 5000,
              positionClass: 'toast-top-center',
            }
          );
          this.descargarDocumento(response['nombre']);
          this.loadingCreation = false;
        },
        (err) => {
          this.loadingCreation = false;

          console.error(err);
          let error = err.error.message;
          if (error === 'EMAIL_ALREADY_USED_MULTIPLE') {
            let email = err.error.email;
            this.toastr.error(
              this.translate.instant('FLOW.TOAST.EMAIL_ALREADY_USED_MULTIPLE') +
                ' ' +
                email,
              this.translate.instant(
                'FLOW.TOAST.EMAIL_ALREADY_USED_MULTIPLE_TITLE'
              ),
              {
                timeOut: 5000,
                positionClass: 'toast-top-center',
              }
            );
            return;
          } else
            this.toastr.error(
              'Ocurrió un error al crear los usuarios',
              'Error',
              {
                timeOut: 5000,
                positionClass: 'toast-top-center',
              }
            );
        }
      );
  }

  onRegionChange(regionChange: any) {
    this.communes = getComunasByRegion(regionChange.value);
    // this.studentFormControls.institution_commune.enable();
  }

  openPreview() {
    this.matDialog.open(DialogUsersPreviewComponent, {
      width: '60%',
      data: this.userCreateForm.value,
    });
  }

  descargarDocumento(nombre: string) {
    const uriBase = environment.serverRoot + this.user._id + '/' + nombre;
    FileSaver.saveAs(uriBase, nombre);
  }

  onTabChange(event: any): void {
    if (event.index === 1) {
      this.getFileList();
    }
  }

  getFileList() {
    this.loadingFiles = true;
    this.authService.getUsersCSV(this.user._id).subscribe(
      (response) => {
        console.log('files', response);
        let files = response['files'];
        this.files = files.map((file) => {
          const timestampMatch = file.match(/_(\d+)\.csv/);
          if (timestampMatch) {
            const timestamp = parseInt(timestampMatch[1], 10);
            const fechaCreacion = new Date(timestamp);
            // Convierte el timestamp a una fecha formateada
            const dd = String(fechaCreacion.getDate()).padStart(2, '0');
            const mm = String(fechaCreacion.getMonth() + 1).padStart(2, '0'); // ¡Recuerda que los meses están basados en cero!
            const yyyy = fechaCreacion.getFullYear();
            const hh = String(fechaCreacion.getHours()).padStart(2, '0');
            const min = String(fechaCreacion.getMinutes()).padStart(2, '0');

            const fecha = `${dd}/${mm}/${yyyy} ${hh}:${min}`;
            return { nombre: file, fecha };
          } else {
            return { nombre: file, fecha: 'Sin Fecha' };
          }
        });
        console.log(this.files);
        this.loadingFiles = false;
      },
      (err) => {
        this.loadingFiles = false;

        console.error(err);
        this.toastr.error(
          'Ocurrió un error al obtener los archivos creados',
          'Error',
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          }
        );
      }
    );
  }
}
