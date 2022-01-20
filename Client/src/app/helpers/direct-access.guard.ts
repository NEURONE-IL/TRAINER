import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectAccessGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // If the previous URL was blank, then the user is directly accessing this page
    if (this.router.url === '/') {
      console.log("Bloqueado por DirectAccessGuard");
      this.router.navigate(['login']); // Navigate away to some other page
      return false;
    }
    return true;
  }
  
}
