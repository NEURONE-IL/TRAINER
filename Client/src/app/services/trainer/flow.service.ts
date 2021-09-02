import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Flow {
  _id: string,
  name: string,
  description: string,
  sorted: { type: Boolean, required: true },
  image_url: string,
  image_id: string,
  createdAt: string,
  updatedAt: string
}

@Injectable({
  providedIn: 'root'
})
export class FlowService {

  uri = environment.apiURL + 'flow/';

  constructor(protected http: HttpClient) { }

  getFlowDummy(flowId: string): Observable<any> {
    return this.http.get(environment.apiURL + 'user/' + flowId +'/findTestUser', { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  resetFlowDummy(flowId: string): Observable<any> {
    return this.http.get(environment.apiURL + 'user/' + flowId +'/resetTestUser', { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getFlows(): Observable<any> {
    return this.http.get(this.uri, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getFlow(id: string): Observable<any> {
    return this.http.get(this.uri+id, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  deleteFlow(id: string): Observable<any> {
    return this.http.delete(this.uri+id, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  postFlow(flow: any): Observable<any> {
    return this.http.post(this.uri, flow, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  putFlow(flowId: string, updatedFlow: any): Observable<any> {
    return this.http.put(this.uri+flowId, updatedFlow, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getFlowSignup(id: string): Observable<any> {
    return this.http.get(this.uri+id+'/getForSignup');
  }
}
