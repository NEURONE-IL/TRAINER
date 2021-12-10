import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StoreTrackService {

  eventUri = environment.apiURL + 'event';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Save events
  postEvent(data){
    if(this.authService.loggedIn){
      data.userId = this.authService.getUser()._id;
      this.http.post(this.eventUri, data, { headers: {'x-access-token': localStorage.getItem('auth_token')} })
      .subscribe((resp: any) => {
        },
        (error) => {
          console.log(error);
        }
        );
      }    
  }

}