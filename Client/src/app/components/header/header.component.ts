import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  homeTooltip: string;
  user: any;  

  constructor( private authService: AuthService,
               private translate: TranslateService,
               private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.loggedIn;
    if( this.isLoggedIn){
      this.user = this.authService.getUser();
    }    
  }

  ngAfterContentChecked() {
    this.homeTooltip = this.translate.instant("HEADER.TOOLTIP");
    this.changeDetector.detectChanges();
  }

  logout(){
    this.authService.confirmLogout();
  }

}
