import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { Stage, StageService } from '../../services/trainer/stage.service';
import { Flow, FlowService } from "../../services/trainer/flow.service";
import { ApiTriviaService } from "../../services/apiTrivia/apiTrivia.service";
import { ApiSGService } from '../../services/apiSG/apiSG.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

import { ModuleService } from 'src/app/services/trainer/module.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'show-flow',
  templateUrl: './show-flow.component.html',
  encapsulation: ViewEncapsulation.Emulated, // ???
  styleUrls: ['./show-flow.component.css']
})
export class ShowFlowComponent implements OnInit {

  @Input() flowId: string;
  @Input() studentId: string;
  flow: Flow;
  stages = [];
  sortedStages: Stage[] = [];
  columnHeader: string[] = ['NombreCol', 'TipoCol']
  mostrarEtapas: boolean = false;
  modules: any [];
  selectedModule: any;


  constructor(
    private route: ActivatedRoute,
    private stageService: StageService,
    private flowService: FlowService,
    private triviaService: ApiTriviaService,
    private moduleService: ModuleService,
    private router: Router,
    private toastr: ToastrService,
    private apiSGService: ApiSGService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    /*
    this.stageService.getStageByStudent(this.studentId)
      .subscribe(response => {
        this.sortedStages = response['stages'];
      });
    */
    this.moduleService.getModuleByFlow(this.flowId)
      .subscribe(response => {
        this.modules = response['modules'];
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
    this.stageService.updateProgress(this.studentId, this.flowId, stageId, 100).subscribe(response => {
      this.sortedStages = response['stages'];
    });
  }

  enClick(row){
    this.selectedModule=row
  }

  displayStages(){
    this.mostrarEtapas = !this.mostrarEtapas
  }
}
