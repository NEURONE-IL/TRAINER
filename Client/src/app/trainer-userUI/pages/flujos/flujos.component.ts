import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { TrainerUserUIService } from '../../services/trainer-user-ui.service';

import { Flow } from '../../interfaces/flow.interface';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../../services/auth/auth.service';

import { MatDialog } from '@angular/material/dialog';
import { MedalDialogComponent } from '../../components/medal-dialog/medal-dialog.component';
import { FlowService } from 'src/app/services/trainer/flow.service';

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

  }

  //para evitar error "Expression has changed after it was checked"
  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();

    this.modulosCompletados = +localStorage.getItem('modulosCompletados');
    this.etapasCompletadas = +localStorage.getItem('etapasCompletadas');

  }

  ngOnDestroy(): void {
    console.log("llamado ondestroy");
    
    localStorage.removeItem("modulosCompletados");
    localStorage.removeItem("etapasCompletadas");

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

  // Primera medalla se asigna por el primer login, por lo tanto siempre estara desbloqueado
  // condicionMedallaA() : boolean {}

  // Segunda medalla se asigna por completar la primera etapa
  condicionMedallaB(): boolean{
    if(this.etapasCompletadas >= 1){
      return false;
    }
    else{
      return true;
    }
  }

  // Tercera medalla se asigna por completar el primer modulo
  condicionMedallaC(): boolean{
    if(this.modulosCompletados >= 1){
      return false;
    }
    else{
      return true;
    }
  }

  // Cuarta medalla se asigna por completar el 50% de las etapas totales
  condicionMedallaD(): boolean{
    if(this.etapasCompletadas >= this.totalDeEtapas/2){
      return false;
    }
    else{
      return true;
    }
  }

  // Quinta medalla se asigna por completar todo el flujo (100% de etapas totales)
  condicionMedallaE(): boolean{
    if(this.etapasCompletadas == this.totalDeEtapas){
      return false;
    }
    else{
      return true;
    }
  }

  openDialog(lockStatus: boolean, medalID: string) {

    let objeto = {lockStatus, medalID}
    this.dialog.open(MedalDialogComponent, { data: objeto })
  }
}
