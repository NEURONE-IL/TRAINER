import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService} from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  uri = environment.apiURL + 'invitation/';

  constructor( protected http: HttpClient, private authService: AuthService ) { }

  getInvitationByUser(userId: string): Observable<any>{
    return this.http.get(this.uri +'byUser/'+userId);
  }
  checkExistingInvitation(userId: string, flowId: string): Observable<any>{
    return this.http.get(this.uri +'checkExist/'+userId+'/'+flowId);
  }
  seeInvitation(invitation: any): Observable<any>{
    return this.http.put(this.uri + 'seeInvitations/', invitation)
  }
  acceptInvitation(invitation: any, type: string): Observable<any>{
    return this.http.put(this.uri + 'acceptInvitation/'+type, invitation)
  }
  rejectInvitation(invitation: any, type: string): Observable<any>{
    return this.http.put(this.uri + 'rejectInvitation/'+type, invitation)
  }
  requestCollab(invitation: any): Observable<any>{
    return this.http.post(this.uri + 'requestCollaboration/', invitation)
  }
}