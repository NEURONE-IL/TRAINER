import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Flow, FlowService } from '../../services/trainer/flow.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-flows-display',
  templateUrl: './flows-display.component.html',
  styleUrls: ['./flows-display.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class FlowsDisplayComponent implements OnInit {
  flujoActivo = true;
  quizActivo = false;
  videoActivo = false;
  usuariosActivo = false;
  editar = false;
  crear = true;

  user: any;
  noFlows: boolean = false;
  indexTab: number = 0;

  constructor(
    private flowService: FlowService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    /*this.flowService.getFlows().subscribe(
      response => {
        this.flows = response['flows'];
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );*/
  }

  //eventos
  select(nombre: string) {
    console.log(nombre);
    let target = nombre;
    if (target == 'flujo') {
      this.flujoActivo = true;
      this.quizActivo = false;
      this.videoActivo = false;
      this.usuariosActivo = false;
    } else if (target == 'quizes') {
      this.flujoActivo = false;
      this.quizActivo = true;
      this.videoActivo = false;
      this.usuariosActivo = false;
    } else if (target == 'videos') {
      this.videoActivo = true;
      this.quizActivo = false;
      this.flujoActivo = false;
      this.usuariosActivo = false;
    } else if (target == 'usuariosActivo') {
      this.usuariosActivo = true;
      this.videoActivo = false;
      this.quizActivo = false;
      this.flujoActivo = false;
    }
  }
  selectSubMenu(nombre, event) {}
}
