import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Stage } from './stage.service';

export interface Module {
  _id: string,
  name: string,
  description: string,
  code: string,
  flow: string,
  image_url: string,
  image_id: string
}

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  uri = environment.apiURL + 'module/';

  eventsSources: EventSource[] = [];
  constructor(protected http: HttpClient, private _zone: NgZone) { }

  getModules(): Observable<any> {
    return this.http.get(this.uri, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getModule(id: string): Observable<any> {
    return this.http.get(this.uri+id, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getModuleByFlow(flowId: string): Observable<any> {
    return this.http.get(this.uri + 'byFlow/' + flowId, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  deleteModule(id: string): Observable<any> {
    return this.http.delete(this.uri+id, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  postModule(flow: any): Observable<any> {
    return this.http.post(this.uri, flow, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  putModule(moduleId: string, updatedModule: any): Observable<any> {
    return this.http.put(this.uri+moduleId, updatedModule);
  }

  // Control de concurrencia
  requestForEdit(moduleId: string, user: any): Observable<any> {
    return this.http.put(this.uri+'requestEdit/'+moduleId, user);
  }

  releaseForEdit(moduleId: string, user: any): Observable<any> {
    return this.http.put(this.uri+'releaseModule/'+moduleId, user);
  }

  getServerSentEvent(moduleId: string,userId: string): Observable<any> {
    return new Observable((observer) => {

    let eventSource = this.getEventSource(moduleId,userId);
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

  closeEventSourcebyUrl(moduleId: string, userId: string): void{
    let url = this.uri+'/editStatus/'+moduleId+'/'+userId;
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

  getEventSource(moduleId: string, userId: string): EventSource {
    return new EventSource(this.uri+'editStatus/'+moduleId+'/'+userId);
  }

}
