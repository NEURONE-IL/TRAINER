import {Component, Inject, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Flow, FlowService } from '../../services/trainer/flow.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-flow-update',
  templateUrl: 'flow-update.component.html',
  styleUrls: ['./flow-update.component.css']
})
export class FlowUpdateComponent implements OnInit{
  flowForm: FormGroup;
  loading: Boolean;
  file: File;

  constructor(@Inject(MAT_DIALOG_DATA)
    public flow: Flow,
    private formBuilder: FormBuilder,
    private flowService: FlowService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public matDialog: MatDialog) { }

  ngOnInit(): void {
    this.flowForm = this.formBuilder.group({
      name: [this.flow.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [this.flow.description, [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],

      sorted: [this.flow.sorted, [Validators.required]]
    });
    this.loading = false;
  }

  get flowFormControls(): any {
    return this.flowForm['controls'];
  }

  resetForm() {
    this.flowForm.reset();
  }

  updateFlow(flowId: string){
    this.loading = true;
    let flow = this.flowForm.value;
    let formData = new FormData();
    formData.append('name', flow.name);
    formData.append('description', flow.description);
    formData.append('sorted', this.flow.sorted.toString());
    if(this.file){
      formData.append('file', this.file);
    }
    this.flowService.putFlow(flowId, formData).subscribe(
      flow => {
        this.toastr.success(this.translate.instant("FLOW.TOAST.SUCCESS_MESSAGE_UPDATE") + ': ' + flow['flow'].name, this.translate.instant("FLOW.TOAST.SUCCESS"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.loading = false;
        this.matDialog.closeAll();
      },
      err => {
        this.toastr.error(this.translate.instant("FLOW.TOAST.ERROR_MESSAGE_UPDATE"), this.translate.instant("FLOW.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  handleFileInput(files: FileList) {
    this.file = files.item(0);
  }
}