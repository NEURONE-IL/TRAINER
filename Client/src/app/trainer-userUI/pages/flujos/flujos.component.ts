import { Component, OnInit } from '@angular/core';

import { TrainerUserUIService } from '../../services/trainer-user-ui.service';

import { Flow } from '../../interfaces/flow.interface';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-flujos',
  templateUrl: './flujos.component.html',
  styleUrls: ['./flujos.component.css']
})
export class FlujosComponent implements OnInit{

  flow    : Flow;
  flowId  : string;
  user    : User;

  constructor(
//    private FlowService           : FlowService,
    private trainerUserUIService  : TrainerUserUIService,
    private authService           : AuthService
  ) { }

  ngOnInit(): void {
    
    //conseguir datos del usuario
    this.user = this.trainerUserUIService.getUser()
    console.log(this.user);
    
    //guardar id del flujo
    this.flowId = this.user.flow;
    
    //obtener datos del flujo
    this.obtenerFlujo( this.flowId );
  
  }

  //obtiene el objeto del flujo a través de un id
  //TODO: cambiar el servicio
  obtenerFlujo(id: string){
//    this.FlowService.getFlow(id)
    this.trainerUserUIService.getFlow(id)
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

}
