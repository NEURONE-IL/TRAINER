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

  studioSelected: any;

  ngOnInit(): void {
    this.checkPath();
  }

  createStudy(){
    this.router.navigate(['create-study']);
  }

  createChallenge(){
    this.router.navigate(['create/challenge']);
  }

  studySelectedHandler(event){
    this.studioSelected = true;
    this.router.navigate([event]);
  }

  checkPath(){
    let path= this.router.url;
    if(path!= '/admin_panel'){
      this.studioSelected = true;
    }
    else{
      this.studioSelected = false;
    }
  }
}
