import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private router: Router, private toastr: ToastrService, private translate: TranslateService) { }

  flowSelected: any;

  ngOnInit(): void {
    this.checkPath();
  }

  createFlow(){
    this.router.navigate(['create-flow']);
  }

  createChallenge(){
    this.router.navigate(['create/challenge']);
  }

  flowSelectedHandler(event){
    this.flowSelected = true;
    this.router.navigate([event]);
  }

  checkPath(){
    let path= this.router.url;
    if(path!= '/admin_panel'){
      this.flowSelected = true;
    }
    else{
      this.flowSelected = false;
    }
  }
}
