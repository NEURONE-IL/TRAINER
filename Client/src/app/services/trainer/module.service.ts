import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Stage } from './stage.service';

export interface Module {
  _id: string,
  name: string,
  description: string,
  code: string,
  image_url: string,
  image_id: string
}

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  uri = environment.apiURL + 'module/';

  constructor(protected http: HttpClient) { }

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

  putModule(modeuleId: string, updatedModule: any): Observable<any> {
    return this.http.put(this.uri+modeuleId, updatedModule, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

}
