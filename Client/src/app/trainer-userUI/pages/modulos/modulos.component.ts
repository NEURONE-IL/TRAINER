import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { trigger, state, style, transition, animate } from '@angular/animations';

import { Flow } from '../../interfaces/flow.interface';
import { User } from '../../interfaces/user.interface';
import { Stage } from '../../interfaces/stage.interface';
import { Module } from '../../interfaces/module.interface';

import { TrainerUserUIService } from '../../services/trainer-user-ui.service';

import { MatDialog } from '@angular/material/dialog';
import { DescriptionDialogComponent } from '../../components/description-dialog/description-dialog.component';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ModulosComponent implements OnInit {

  @Input() flow: Flow;
  @Input() user: User;
  @Input() flowId: string;
  
  columnHeader  : string[] = ['NombreCol', 'TipoCol', 'DescriptionCol'];

  stages            : Stage[] = [];
  sortedStages      : Stage[] = [];
  modules           : Module[] = [];
  selectedModule    : Module = {} as Module;
  descriptionDialog : DescriptionDialogComponent;

  constructor(
    private trainerUserUIService : TrainerUserUIService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
//    private moduleService : ModuleService
  ) { }

  ngOnInit(): void {
 
    this.getModules(this.flowId);

  }

  ngDoCheck(): void{
    //revisar si se han completado todas las etapas del modulo anterior
    if(this.modules){
      for(let i=1; i<this.modules.length; i++){

        if(this.modules[i-1].stages.every(etapa => etapa.percentage == 100)){
          this.modules[i].locked = false;
        }

      }
    }
  }

  //para evitar error "Expression has changed after it was checked"
  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  getModules(id: string){

//    this.moduleService.getModuleByFlow(this.flow._id)
    this.trainerUserUIService.getModuleByFlow(this.flow._id)
      .subscribe(response => {
        this.modules = response.modules.filter(modulo => modulo.stages.length > 0); //Se eliminan los modulos sin etapas
        
        if(this.modules.length != 0){
          //eventualmente cambiar selectedModule al primer modulo no completado por el usuario.
          this.selectedModule = this.modules[0];

          //En caso de flujo ordenado se deben bloquear los modulos, por lo tanto 
          //se agrega estado de bloqueado desde el segundo en adelante, pero
          //se agrega estado desbloqueado (locked=false) al primero por consistencia de modelo.

          if(this.flow.sorted){
            this.modules[0].locked = false;

            for(let i=1; i<this.modules.length; i++){
              this.modules[i].locked = true;
            }
          }
        }
      },
      (err) => { console.error(err); }
    )
  }

  //obtiene un string para mostrar en la columna de completados (en la tabla de modulos)
  getCompleted(modulo: any){
    /* improbable que suceda, dado que se filtran los modulos sin etapas
    if (modulo.stages.length == 0){
      return "-";
    }
    */

    let completado = 0;
    for(let i = 0; i < modulo.stages.length; i++){
      if(modulo.stages[i].percentage == 100){
        completado = completado + 1;
      }
    }
    return completado + "/" + modulo.stages.length;
    
  }

  enClick(event: MouseEvent, row: Module){

    event.preventDefault();
    event.stopPropagation();

    this.selectedModule = this.selectedModule == row ? null : row; 
  }

  // para abrir ventana de descripcion
  openDialog(event: MouseEvent, modulo: Module) {

    event.preventDefault();
    event.stopPropagation();

    this.dialog.open(DescriptionDialogComponent, { data: modulo })
  }
}