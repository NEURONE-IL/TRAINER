import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Flow {
  _id: string,
  name: string,
  description: string,
  assistant: string,
  sorted: { type: Boolean, required: true },
  image_url: string,
  image_id: string,

  privacy: boolean,
  user: any,
  collaborators: any[],
  tags: string[],
  levels: number[],
  competences: any[],
  language: string,

  createdAt: string,
  updatedAt: string
}

@Injectable({
  providedIn: 'root'
})
export class FlowService {

  uri = environment.apiURL + 'flow/';

  constructor(protected http: HttpClient) { }

  getFlowTestUser(flowId: string): Observable<any> {
    return this.http.get(environment.apiURL + 'user/' + flowId +'/findTestUser', { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  resetFlowTestUser(flowId: string): Observable<any> {
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
    console.log(flow);
    return this.http.post(this.uri, flow, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  putFlow(flowId: string, updatedFlow: any): Observable<any> {
    return this.http.put(this.uri+flowId, updatedFlow, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getFlowSignup(id: string): Observable<any> {
    return this.http.get(this.uri+id+'/getForSignup');
  }

  //Valentina

  getFlowsByUser(userId: string): Observable<any> {
    return this.http.get(this.uri +'byUser/'+userId)
  }
  getFlowsByUserCollaboration(userId: string): Observable<any> {
    return this.http.get(this.uri +'byUserCollaboration/'+userId)
  }
  //Se obtienen los estudios filtrados según privacidad
  getFlowsByUserByPrivacy(params: any): Observable<any> {
    return this.http.get(this.uri +'byUserbyPrivacy/'+params.user+'/'+params.privacy)
  }
  getFlowsByUserByType(params: any): Observable<any> {
    return this.http.get(this.uri +'byUserbyType/'+params.user+'/'+params.type)
  }
  getAllFlowsByPrivacy(privacy: boolean, userId): Observable<any>{
    return this.http.get(this.uri+'byPrivacy/'+privacy+'/'+userId)
  }
  editCollaboratorsFlow(flowId: string, collaborators: any): Observable<any> {
    let reqBody = {collaborators: collaborators}
    return this.http.put(this.uri+'editCollaborators/'+flowId, reqBody);
  }
  cloneFlow(flowId: string, userId: string): Observable<any>{
    return this.http.get(this.uri+'clone/'+flowId+'/user/'+userId);
  }
}
