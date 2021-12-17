import {Component, Inject, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { Stage, StageService } from '../../services/trainer/stage.service';
import { Flow, FlowService } from "../../services/trainer/flow.service";
import { ApiTriviaService } from "../../services/apiTrivia/apiTrivia.service";
import { ApiSGService } from '../../services/apiSG/apiSG.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

import { Module, ModuleService } from 'src/app/services/trainer/module.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatSelectModule } from '@angular/material/select';
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
  stages: Stage[] = [];
  sortedStages: Stage[] = [];
  columnHeader: string[] = ['NombreCol', 'TipoCol', 'DescriptionCol']
  vacio: boolean = true;
  modules: Module [];
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
    private dialog: MatDialog
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
      this.modules = response['modules'];
      if(this.modules.length != 0){
        //eventualmente cambiar selectedModule al primer modulo no completado por el usuario.
        this.selectedModule = this.modules[0];
        this.vacio = false;
      }
  });
    
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
  //En caso de que se seleccione abrir la ventanilla de descripcion este metodo no debe llamarse.
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
        return '../../../assets/flow-images/Flow00.jpg';
    }
  }

  //obtiene un string para mostrar en la columna de completados (en la tabla de modulos)
  getCompleted(modulo: any){
    if (modulo.stages.length == 0){
      return "-";
    }

    //necesito ver las etapas completadas para poder asignar un valor distinto de 0
    else {
      return "0/" + modulo.stages.length;
    }
  }

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
    private data: Module  
  ) {}

  getCode(): string {
    return this.data.code;
  }

  getDescription(): string{
    return this.data.description;
  }

}


