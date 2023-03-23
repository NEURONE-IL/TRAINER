import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { FlowService } from '../services/trainer/flow.service';

@Injectable({
  providedIn: 'root'
})
export class ProtectSearchDisplayGuard implements CanActivate {
  constructor(private authService: AuthService, private flowService: FlowService, private router: Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let owner: boolean;
    let colls: any;
    let privacy: boolean;
    let _user: any;
    const validation = async () => {
    await this.flowService.getFlow(next.paramMap.get('flow_id')).toPromise()
      .then(response => {
        let flow = response['flow'];
        _user = this.authService.getUser()._id;
        owner = flow.user._id === _user
        colls = flow.collaborators
        privacy = flow.privacy
      })
      .catch(err => {console.log(err); return this.router.navigate(['/admin_panel']) })
      
      if(owner){
        return this.router.navigate(['/admin_panel']);
      }
      else if(privacy){
        if(colls.findIndex( coll => (coll.invitation === 'Pendiente' && coll.user._id === _user)) >= 0)
          return true
        else
          return this.router.navigate(['/admin_panel']);
      }
      else{
        return true
      }  
    }
    return validation();
  }
  
}
