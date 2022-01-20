import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'description-dialog',
  templateUrl: './description-dialog.component.html'
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