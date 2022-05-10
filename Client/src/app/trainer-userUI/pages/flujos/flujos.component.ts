import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { TrainerUserUIService } from '../../services/trainer-user-ui.service';

import { Flow } from '../../interfaces/flow.interface';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../../services/auth/auth.service';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FlowService } from 'src/app/services/trainer/flow.service';
import { TimerDialogComponent } from '../../components/timer-dialog/timer-dialog.component';

@Component({
  selector: 'app-flujos',
  templateUrl: './flujos.component.html',
  styleUrls: ['./flujos.component.css']
})
export class FlujosComponent implements OnInit{

  flow                : Flow;
  flowId              : string;
  user                : User;

  totalDeModulos      : number = 0;
  totalDeEtapas       : number = 0;
  
  modulosCompletados  : number = 0;
  etapasCompletadas   : number = 0;
  
  constructor(
    private flowService           : FlowService,
    private trainerUserUIService  : TrainerUserUIService,
    private authService           : AuthService,
    private cdRef                 : ChangeDetectorRef,
    private dialog                : MatDialog,
  ) { }

  ngOnInit(): void {
    
    //conseguir datos del usuario
    this.user = this.authService.getUser()
    console.log(this.user);
    
    //guardar id del flujo
    this.flowId = this.user.flow;
    
    //obtener datos del flujo
    this.obtenerFlujo( this.flowId );

    //colocar un valor de 0 en modulos completados
    localStorage.setItem('modulosCompletados', (0).toString());
    localStorage.setItem('etapasCompletadas', (0).toString());

    //TODO: bloquear usuario en caso de que haya cumplido su cuota de niveles por dia
    // if(etapasPorCompletar == 0){
    // this.openTimerDialog();
    // }
  }

  //para evitar error "Expression has changed after it was checked"
  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();

    this.modulosCompletados = +localStorage.getItem('modulosCompletados');
    this.etapasCompletadas = +localStorage.getItem('etapasCompletadas');

  }

  ngOnDestroy(): void {
    
    localStorage.removeItem("modulosCompletados");
    localStorage.removeItem("etapasCompletadas");

    this.trainerUserUIService.indiceEncontrado = false;
    this.trainerUserUIService.nextStage = null;
  }

  //obtiene el objeto del flujo a través de un id

  obtenerFlujo(id: string){
    this.flowService.getFlow(id)
      .subscribe( (resp) => {
        this.flow = resp.flow;
        },
        (err) => {
        console.error(err);
        }
      )
  }

  logout(){
    this.authService.confirmLogout();
  }

  obtenerTotalDeModulos( argumento: number ){    
    this.totalDeModulos = argumento;
  }

  obtenerTotalDeEtapas( argumento: number ){
    this.totalDeEtapas += argumento;
  }

  obtenerModulosCompletados( argumento: number ){
    this.modulosCompletados += argumento;
  }

  obtenerEtapasCompletadas( argumento: number ){
    this.etapasCompletadas += argumento;
  }

  openTimerDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      user: this.user,
      timer: true,
      test: 'prueba'
    }
    
    this.dialog.open(TimerDialogComponent, dialogConfig)
  }
}
