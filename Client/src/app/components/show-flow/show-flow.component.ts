import {Component, Inject, EventEmitter, Input, OnInit, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import { Stage, StageService } from '../../services/trainer/stage.service';
import { Flow, FlowService } from "../../services/trainer/flow.service";
import { ApiTriviaService } from "../../services/apiTrivia/apiTrivia.service";
import { ApiSGService } from '../../services/apiSG/apiSG.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

import { Module, ModuleService } from 'src/app/services/trainer/module.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'show-flow',
  templateUrl: './show-flow.component.html',
  encapsulation: ViewEncapsulation.Emulated, // ???
  styleUrls: ['./show-flow.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ShowFlowComponent implements OnInit {

  @Input() flow: Flow;
  @Input() studentId: string;
  @Input() progress: any;

  stages: Stage[] = [];
  sortedStages: Stage[] = [];
  columnHeader: string[] = ['NombreCol', 'TipoCol', 'DescriptionCol']
  vacio: boolean = true;
  modules: any [];
  selectedModule: Module | null;

  constructor(
    private route: ActivatedRoute,
    private stageService: StageService,
    private flowService: FlowService,
    private triviaService: ApiTriviaService,
    private moduleService: ModuleService,
    private router: Router,
    private toastr: ToastrService,
    private apiSGService: ApiSGService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    /*
    this.stageService.getStageByStudent(this.studentId)
      .subscribe(response => {
        this.sortedStages = response['stages'];
      });
    
    this.moduleService.getModuleByFlow(this.route.snapshot.paramMap.get('flow_id'))
      .subscribe(response => {
        this.modules = response['modules'];
        if(this.modules.length != 0){
          this.selectedModule = this.modules[0];
          this.vacio = false;
        }
    });
    */
    //DEBUG
      
    
    this.moduleService.getModuleByFlow(this.flow._id)
    .subscribe(response => {
      this.modules = response['modules'].filter(modulo => modulo.stages.length > 0); //Se eliminan los modulos sin etapas
      if(this.modules.length != 0){
        //eventualmente cambiar selectedModule al primer modulo no completado por el usuario.
        this.selectedModule = this.modules[0];
        this.vacio = false;

        //En caso de flujo ordenado se deben bloquear los modulos, por lo tanto 
        //se agrega estado de bloqueado desde el segundo en adelante.
        //Se agrega estado desbloqueado al primero por consistencia de modelo.

        if(this.flow.sorted){
          this.modules[0]["locked"] = false;

          for(let i=1; i<this.modules.length; i++){
            this.modules[i]["locked"] = true;
          }
          
        }
        console.log("modulos: ", this.modules);
        
      }
    });

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

  getClass(active, type){
    if(!active){
      return 'Disabled';
    }
    if(type === 'Trivia'){
      return 'Trivia';
    }
    else if(type === 'SG'){
      return 'SG';
    }
    else if(type === 'Video'){
      return 'Video';
    }
    else if(type === 'Video + Quiz'){
      return 'VideoQuiz';
    }    
  }

  goToStage(stage){
    console.log(stage);
    if (stage.type === 'Video'){
      this.router.navigate(['/videoModule']);
    }
    if (stage.type === 'Trivia'){
      window.location.href = this.triviaService.getStudyLink(stage.externalId, this.authService.getUser());
    }
    if (stage.type === 'SG'){
      window.location.href = this.apiSGService.getAdventureLink(stage.externalId);
      return;
    }
  }

  getLinkToTriviaStudy(studyId){
    return this.triviaService.getStudyLink(studyId, this.authService.getUser());
  }

  formatDate(date){
    return date.substr(0,10);
  }

  updateProgress(stageId){
    this.stageService.updateProgress(this.studentId, this.flow._id, stageId, 100).subscribe(response => {
      this.sortedStages = response['stages'];
    });
  }

  //funcion que permite asignar la fila seleccionada al atributo selectedModule.
  //En caso de que se clickee el icono de descripcion este metodo no debe llamarse.
  enClick(event: MouseEvent, row: Module){

    event.preventDefault();
    event.stopPropagation();

    this.selectedModule = this.selectedModule == row ? null : row;
    
  }

  getCover(type: string): string{
    switch (type) {
      case 'Trivia':
        return '../../../assets/stage-images/00Trivia.jpg';
      case 'SG':
        return '../../../assets/stage-images/01Adventure.jpg';
      case 'Video':
        return '../../../assets/stage-images/02Video.jpg';
      default:
        return '../../../assets/flow-images/Flow00_Ext.jpg';
    }
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

  // para abrir ventana de descripcion
  openDialog(event: MouseEvent, modulo: Module) {

    event.preventDefault();
    event.stopPropagation();

    this.dialog.open(DescriptionDialogComponent, { data: modulo })
  }

}

@Component({
  selector: 'description-dialog',
  templateUrl: 'description-dialog.html'
})
export class DescriptionDialogComponent{

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data  
  ) {}

  getCode(): string {
    return this.data.code;
  }

  getDescription(): string{
    return this.data.description;
  }

  getModulo(){
    return this.data;
  }

}


