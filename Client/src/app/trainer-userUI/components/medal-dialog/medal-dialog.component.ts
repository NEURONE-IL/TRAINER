import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-medal-dialog',
  templateUrl: './medal-dialog.component.html',
  styles: [`
    img {
      border-radius: 10px;
      width: 100%;
      height: auto;
    }
  `]
})
export class MedalDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data  
  ) {}
  
  getMedalData(){
    return this.data;
  }

}
