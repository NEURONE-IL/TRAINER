import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-timer-dialog',
  templateUrl: './timer-dialog.component.html',
  styles: [
  ]
})
export class TimerDialogComponent implements OnInit, OnDestroy{

  constructor(    @Inject(MAT_DIALOG_DATA)
  private data,
  private dialogRef: MatDialogRef<TimerDialogComponent>,
  private authService : AuthService) { }

  // TIMER SECTION START
  tiempo: number;

  horas     : string | number;
  minutos   : string | number;
  segundos  : string | number;

  horasDisplay      : string | number = 'XX';
  minutosDisplay    : string | number = 'XX';
  segundosDisplay   : string | number = 'XX';

  activo: boolean = false;
  countDown = interval(1000)
    .subscribe( _ => {
      this.tiempo -= 1;
      
      this.horas    = Math.floor(this.tiempo / 3600);
      this.minutos  = Math.floor((this.tiempo / 60) % 60);
      this.segundos = Math.floor(this.tiempo % 60);

      this.horasDisplay     = (this.horas < 10) ? '0' + this.horas : this.horas;
      this.minutosDisplay   = (this.minutos < 10) ? '0' + this.minutos : this.minutos;
      this.segundosDisplay  = (this.segundos < 10) ? '0' + this.segundos : this.segundos;
    });

  timer;
  //TIMER SECTION END

  ngOnInit() {
    //TODO: Captura de datos, cuanto tiempo debe esperar y cuantas etapas ha jugado;
    this.tiempo= 10;

    this.horas    = Math.floor(this.tiempo / 3600);
    this.minutos  = Math.floor(this.tiempo / 60);
    this.segundos = Math.floor(this.tiempo % 60);

    this.timer = new Promise( (resolve, reject) =>{
      setTimeout(() => {
        resolve( this.dialogRef.close() ); 
      }, this.tiempo*1000)
    });

  }

  ngOnDestroy() {
    this.countDown.unsubscribe();
  }

  getTimerData(){
    return this.data;
  }

  closeDialog(){
    this.dialogRef.close();
  }

  logout(){
    this.authService.logout();
    this.dialogRef.close();
  }

}
