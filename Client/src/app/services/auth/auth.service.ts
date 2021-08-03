import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  uri = environment.apiURL + 'auth/';
  userUri = environment.apiURL + 'user/';

  constructor(private http: HttpClient,
              private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService) {}

  registerAdmin(email: string, password: string, name: string, lastName: string, role: string) {
    this.http.post(this.uri + 'registerAdmin', {email, password,  names: name, last_names: lastName})
      .subscribe((resp: any) => {
          this.router.navigate(['/login']);
        },
        (error) => {
          const error_msg = this.translate.instant('SIGNUP.TOAST.ERROR_MESSAGE');
          console.log('Ha ocurrido un error');
        }
      );
  }

  register(email: string, password: string, name: string, lastName: string, role: string) {
    this.http.post(this.uri + 'register', {email, password,  names: name, last_names: lastName})
      .subscribe((resp: any) => {
          this.router.navigate(['/login']);
        },
        (error) => {
          const error_msg = this.translate.instant('SIGNUP.TOAST.ERROR_MESSAGE');
          console.log('Ha ocurrido un error');
        }
      );
  }

  getActualUserInformation(){
    return localStorage.getItem('currentUser');
  }
  login(email: string, password: string) {
    this.http.post(this.uri + 'login', {email, password})
    .subscribe((resp: any) => {
      localStorage.setItem('auth_token', resp.token);
      localStorage.setItem('currentUser', JSON.stringify(resp.user));
      const sessionLog = {
        userId: resp.user._id,
        userEmail: resp.user.email,
        state: 'login',
        localTimeStamp: Date.now()
      };
      this.redirectUserPanel(resp.user.role.name);
      },
      (error) => {
        let error_msg = this.translate.instant('LOGIN.TOAST.ERROR_MESSAGE');
        if (error.error == 'EMAIL_NOT_FOUND') {
          error_msg = this.translate.instant('LOGIN.TOAST.ERROR_EMAIL_MESSAGE');
        }
        else if (error.error == 'INVALID_PASSWORD') {
          error_msg = this.translate.instant('LOGIN.TOAST.ERROR_CREDENTIALS_MESSAGE');
        }
        else if (error.error = 'USER_NOT_CONFIRMED') {
          error_msg = this.translate.instant('LOGIN.TOAST.ERROR_USER_NOT_CONFIRMED');
        }
        this.toastr.error(error_msg, this.translate.instant('LOGIN.TOAST.ERROR'), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['/']);
      }
      );
  }

  confirmLogout() {
    confirm(this.translate.instant('LOGOUT.LOGOUT_CONFIRMATION')) && this.logout();
  }

  logout() {
    const sessionLog = {
      userId: this.getUser()._id,
      userEmail: this.getUser().email,
      state: 'logout',
      localTimeStamp: Date.now()
    };
    localStorage.removeItem('auth_token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('game');
    this.router.navigate(['login']);
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('auth_token') !== null);
  }

  public isAdmin(): any {
    const role = JSON.parse(localStorage.getItem('currentUser')).role;
    if (role.name == 'admin') { return true; }
    else { return false; }
  }

  public getUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  signup(userData: any, study_id: string) {
    delete userData.emailConfirm;
    return this.http.post(this.uri + 'register/' + study_id, userData);
  }

  redirectUserPanel(role) {
    console.log('redirect');
    if (role == 'admin') {
      console.log('admin');
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['/home']);
    }


  }

}
