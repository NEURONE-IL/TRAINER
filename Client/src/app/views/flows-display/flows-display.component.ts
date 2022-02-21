import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Flow, FlowService } from '../../services/trainer/flow.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-flows-display',
  templateUrl: './flows-display.component.html',
  styleUrls: ['./flows-display.component.css']
})
export class FlowsDisplayComponent implements OnInit {
  flows: Flow[] = [];
  flujoActivo = true;
  quizActivo = false;
  editar= false;
  crear=true;
  constructor(private flowService: FlowService, private router: Router, private toastr: ToastrService, private translate: TranslateService) { }

  ngOnInit(): void {

    this.flowService.getFlows().subscribe(
      response => {
        this.flows = response['flows'];
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("STAGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  //eventos
  select(nombre, event) {
    console.log(nombre);
    let target= event.path[0].id;
    if(target=="flujo"){
      this.flujoActivo=true;
      this.quizActivo=false;
    }else{
      this.flujoActivo=false;
      this.quizActivo=true;
    }
  }
  selectSubMenu(nombre, event){

  }

  getCover(index: number): string{
    return '../../../assets/flow-images/Flow0' + (index%8+1) + '.jpg';
  }

  createFlow(){
    this.router.navigate(['create-flow']);
  }

  @Output() flowSelected: EventEmitter<string>= new EventEmitter();
  clickedFlow(id){
    let link = '/admin_panel/flow/'+ id;
    this.flowSelected.emit(link);
  }

  actualFlow='';

  fullFlow(flow){
    this.actualFlow = flow._id;
  }

  shortFlow(flow){
    this.actualFlow= '';
  }

  showShortDescription(description){
    return (description.substr(0, 40));
  }

  
}

