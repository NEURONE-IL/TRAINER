import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
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
  eventsSources: EventSource[] = [];

  constructor(protected http: HttpClient, private _zone: NgZone) { }

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
    return this.http.get(this.uri+id);
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
  //Se obtienen los flujos filtrados según privacidad
  getFlowsByUserByPrivacy(params: any): Observable<any> {
    return this.http.get(this.uri +'byUserbyPrivacy/'+params.user+'/'+params.privacy)
  }
  getFlowsByUserByType(params: any): Observable<any> {
    return this.http.get(this.uri +'byUserbyType/'+params.user+'/'+params.type)
  }
  editCollaboratorsFlow(flowId: string, collaborators: any): Observable<any> {
    let reqBody = {collaborators: collaborators}
    return this.http.put(this.uri+'editCollaborators/'+flowId, reqBody);
  }
  cloneFlow(flowId: string, userId: string): Observable<any>{
    return this.http.get(this.uri+'clone/'+flowId+'/user/'+userId);
  }

  // Control de concurrencia


  requestForEdit(flowId: string, user: any): Observable<any> {
    return this.http.put(this.uri+'requestEdit/'+flowId, user);
  }
  releaseForEdit(flowId: string, user: any): Observable<any> {
    return this.http.put(this.uri+'releaseFlow/'+flowId, user);
  }

  getServerSentEvent(flowId: string,userId: string): Observable<any> {
    return new Observable((observer) => {

    let eventSource = this.getEventSource(flowId,userId);
    let index = this.eventsSources.push(eventSource);

      this.eventsSources[index-1].onmessage = event => {
        this._zone.run(() => {
          observer.next(event);
        });
      };
      this.eventsSources[index-1].onerror = error => {
        this._zone.run(() => {
          observer.error(error);
        });
      };
    });
  }

  closeEventSourcebyUrl(flowId: string, userId: string): void{
    let url = this.uri+'/editStatus/'+flowId+'/'+userId;
    let index = this.eventsSources.findIndex( ev => ev.url === url);
    if(index != -1){
      this.eventsSources[index].close();
      this.eventsSources.splice(index,1);
    }
  }

  closeAllEventSources(): void {
    this.eventsSources.forEach(event => {
      event.close();
    });
    this.eventsSources = [];
  }

  getEventSource(flowId: string, userId: string): EventSource {
    return new EventSource(this.uri+'editStatus/'+flowId+'/'+userId);
  }
}
