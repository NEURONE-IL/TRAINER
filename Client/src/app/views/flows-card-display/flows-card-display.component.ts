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
  selector: 'app-flows-card-display',
  templateUrl: './flows-card-display.component.html',
  styleUrls: ['./flows-card-display.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class FlowsCardDisplayComponent implements OnInit {
  flows: Flow[] = [];
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
    this.getAllFlowsByUser();
  }
  getCover(index: number): string {
    return '../../../assets/flow-images/Flow0' + ((index % 8) + 1) + '.jpg';
  }
  createFlow() {
    this.router.navigate(['create-flow']);
  }

  @Output() flowSelected: EventEmitter<string> = new EventEmitter();
  clickedFlow(id) {
    let link = '/admin_panel/flow/' + id;
    this.flowSelected.emit(link);
    // this.router.navigate([link]);
  }

  actualFlow = '';

  fullFlow(flow) {
    this.actualFlow = flow._id;
  }

  shortFlow(flow) {
    this.actualFlow = '';
  }

  showShortDescription(description) {
    return description.substr(0, 40);
  }
  onTabClick(event) {
    let index = event.index;
    this.indexTab = index;
    switch (index) {
      case 0: {
        this.getAllFlowsByUser();
        break;
      }
      case 1: {
        //Privados
        var privacy = true;
        this.getFlowsByPrivacy(privacy);
        break;
      }
      case 2: {
        //Publicos
        var privacy = false;
        this.getFlowsByPrivacy(privacy);
        break;
      }
      case 3: {
        var type = 'clone';
        this.getFlowsByType(type);
        console.log('1');
        break;
      }
      case 4: {
        this.getFlowsByCollaboration();
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }
  getAllFlowsByUser() {
    this.flowService.getFlowsByUser(this.user._id).subscribe(
      (response) => {
        this.flows = response['flows'];
        console.log(this.flows);
        if (this.flows.length <= 0) this.noFlows = true;
        else this.noFlows = false;
      },
      (err) => {
        this.toastr.error(
          this.translate.instant('STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR'),
          this.translate.instant('CHALLENGE.TOAST.ERROR'),
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          }
        );
      }
    );
  }
  getFlowsByPrivacy(priv): void {
    let params = { user: this.user._id, privacy: priv };
    this.flowService.getFlowsByUserByPrivacy(params).subscribe(
      (response) => {
        this.flows = response['flows'];
        console.log(this.flows);
        if (!(this.flows.length > 0)) this.noFlows = true;
        else this.noFlows = false;
      },
      (err) => {
        this.toastr.error(
          this.translate.instant('STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR'),
          this.translate.instant('CHALLENGE.TOAST.ERROR'),
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          }
        );
      }
    );
  }
  getFlowsByType(type: string): void {
    let params = { user: this.user._id, type: type };
    this.flowService.getFlowsByUserByType(params).subscribe(
      (response) => {
        this.flows = response['flows'];
        console.log(this.flows);
        if (!(this.flows.length > 0)) this.noFlows = true;
        else this.noFlows = false;
      },
      (err) => {
        this.toastr.error(
          this.translate.instant('STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR'),
          this.translate.instant('CHALLENGE.TOAST.ERROR'),
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          }
        );
      }
    );
  }

  getFlowsByCollaboration(): void {
    this.flowService.getFlowsByUserCollaboration(this.user._id).subscribe(
      (response) => {
        this.flows = response['flows'];
        console.log(this.flows);

        if (!(this.flows.length > 0)) this.noFlows = true;
        else this.noFlows = false;
      },
      (err) => {
        this.toastr.error(
          this.translate.instant('STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR'),
          this.translate.instant('CHALLENGE.TOAST.ERROR'),
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
          }
        );
      }
    );
  }
}
