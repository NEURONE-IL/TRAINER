import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { InvitationService } from 'src/app/services/admin/invitation.service';
import { NotificationService } from 'src/app/services/admin/notification.service';

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

  showOldNotifications:boolean = false;
  adminNotificationN = 0;
  notificationsAdmin: any[];
  newNotificationsAdmin: any[] = [];
  oldNotificationsAdmin: any[] = [];

  constructor( private authService: AuthService,
               private translate: TranslateService,
               private changeDetector: ChangeDetectorRef,
               private toastr: ToastrService,
               public router: Router,
               private invitationService: InvitationService,
               private notificationService: NotificationService
               ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.loggedIn;
    if( this.isLoggedIn){
      this.user = this.authService.getUser();
      this.getAdminNotification();

    }    
  }

  ngAfterContentChecked() {
    this.homeTooltip = this.translate.instant("HEADER.TOOLTIP");
    this.changeDetector.detectChanges();
  }

  logout(){
    this.authService.confirmLogout();
  }

  getAdminNotification(){
    this.notificationService.getNotificationByUser(this.authService.getUser()._id).subscribe(
      response => {
        this.notificationsAdmin = response.notifications;
        console.log(this.notificationsAdmin)
        var activeNotification = 0;
        this.oldNotificationsAdmin = [];
        this.newNotificationsAdmin = [];

        this.notificationsAdmin.forEach( not => {
          let d = new Date(not.createdAt);
          let date = d.getDate() + (d.getMonth() < 10 ? '/0' : '/') + (d.getMonth() + 1) + '/' + d.getFullYear();          
          let hour = (d.getHours() < 10 ? '0' : '') +d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') +d.getMinutes();
          not.createdAt = date + ' ' + hour;
          if(not.seen === false){
            activeNotification++;
            this.newNotificationsAdmin.push(not);
          }
          else{
            if ((not.type === 'invitation' || not.type === 'collabRequest') && not.invitation.status === 'Pendiente'){
              this.newNotificationsAdmin.push(not);
            }
            else{
              this.oldNotificationsAdmin.push(not);
            }
          }
          
        })
        this.adminNotificationN = activeNotification;
      },
      err => {
        console.log(err)
      }
    )
  }

  updateAdminNotifications(){
    const seen = this.notificationsAdmin.some(not => not.seen == false);
    this.showOldNotifications = false;
    if(seen){
      this.notificationService.seeNotification(this.notificationsAdmin[0]).subscribe(
        response => {
          this.getAdminNotification();
        },
        err => {
          console.log(err)
        }
      );
    }
    else{
      this.getAdminNotification();
    }
  }

  acceptInvitation(item: any){
    this.invitationService.acceptInvitation(item.invitation, item.type).subscribe(
      response => {
        if(item.type ==='invitation'){
          this.toastr.success("Ahora es colaborador del flujo: "+ response.invitation.flow.name+'. Puede revisarlo en la pestaña Colaboraciones','Éxito', {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        }
        else{
          this.toastr.success(response.invitation.user.names+' '  +response.invitation.user.last_names + " ahora es colaborador de su flujo: "+ response.invitation.flow.name,'Éxito', {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        }
        
        this.getAdminNotification();
      },
      err => {
        console.log(err)
        this.toastr.error("Ha ocurrido un error al aceptar, intente más tarde", "Error", {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
  rejectInvitation(item: any){
    this.invitationService.rejectInvitation(item.invitation, item.type).subscribe(
      response => {
        console.log(response)
        if(item.type === 'invitation')
          this.toastr.success("Ha rechazado la invitación a colaborar en el flujo: "+ response.invitation.flow.name,"Éxito", {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        else
          this.toastr.success("Ha rechazado la colaboración de: " + response.invitation.user.names+' '  +response.invitation.user.last_names + " en el flujo: "+ response.invitation.flow.name,"Éxito", {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        console.log("Invitación Rechazada");
        this.getAdminNotification();
      },
      err => {
        console.log(err)
        this.toastr.error("Ha ocurrido un error al rechazar, intente más tarde","Error", {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
  redirectStudy(flowId: string,type){
    if(type === 'invitation')
      this.router.navigate(['/flows-search/flow/'+flowId]);
    else
      this.router.navigate(['/admin_panel/flow/'+flowId]);


  }

}
