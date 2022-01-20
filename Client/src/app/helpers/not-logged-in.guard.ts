import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotLoggedInGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.authService.loggedIn){
      if(this.authService.isAdmin()){
        this.router.navigate(['admin_panel']);
      }
      else{
        this.router.navigate(['user-profile']);
      }
      console.log("Bloqueado por NotLoggedInGuard");
      return false;
    }
    else{
      console.log("Bloqueado por NotLoggedInGuard");
      return true;
    }
  }
  
}
