import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import { AuthService} from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  uri = environment.apiURL + 'adminNotification/';

  constructor( protected http: HttpClient, private authService: AuthService ) { }

  getNotificationByUser(userId: string): Observable<any>{
    return this.http.get(this.uri +'byUser/'+userId);
  }
  seeNotification(notification: any): Observable<any>{
    return this.http.put(this.uri + 'seeNotifications/', notification)
  }
}