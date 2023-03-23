import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { FlowService } from '../services/trainer/flow.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectFlowEditionGuard implements CanActivate {
  constructor(private authService: AuthService, private flowService: FlowService, private router: Router){}

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): 
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      let owner: boolean;
      let collaborator: boolean;
      const validation = async () => {
      await this.flowService.getFlow(next.paramMap.get('flow_id')).toPromise()
        .then(response => {
          let flow = response['flow'];
          let _user_id = this.authService.getUser()._id
          owner =  flow.user._id === _user_id
          collaborator = flow.collaborators.some(coll => (coll.user._id === _user_id && coll.invitation != 'Pendiente'))
        })
        .catch(err => {console.log(err); return this.router.navigate(['/admin_panel']) })
        
        if(owner || collaborator){
          return true;
        }
        else{
          return this.router.navigate(['/admin_panel']);
        }  
     }
      return validation();
    }
  
}
