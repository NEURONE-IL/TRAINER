import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  uri = environment.apiURL + 'history/';
  constructor( protected http: HttpClient ) { }

  getHistoryByUser(user_id: string): Observable<any>{
    return this.http.get(this.uri +'byUser/'+user_id);
  }

  getHistoryByUserByType(user_id: string, type: string): Observable<any>{
    return this.http.get(this.uri +'byUserByType/'+user_id+'/'+type);
  }

  getHistoryByFlow(study_id: string): Observable<any>{
    return this.http.get(this.uri +'byFlow/'+study_id);
  }

  getHistoryByFlowByType(study_id: string, type: string): Observable<any>{
    return this.http.get(this.uri +'byFlowByType/'+study_id+'/'+type);
  }
}