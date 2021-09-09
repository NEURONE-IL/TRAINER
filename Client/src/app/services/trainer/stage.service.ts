import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Stage {
  _id: string,
  title: string,
  description: string,
  step: number,
  flow: string,
  type: string,
  externalId: string,
  externalName: string,
  active: boolean,
  createdAt: string,
  updatedAt: string,
  image_url: string,
  image_id: string  
}

@Injectable({
  providedIn: 'root'
})
export class StageService {

  uri = environment.apiURL + 'stage/';

  constructor(protected http: HttpClient) { }

  getStages(): Observable<any> {
    return this.http.get(this.uri, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getStagesByFlow(flowId: string): Observable<any> {
    return this.http.get(environment.apiURL + 'stage/byFlow/' + flowId, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getStagesByFlowSortedByStep(flowId: string): Observable<any> {
    return this.http.get(environment.apiURL + 'stage/byFlowSortedByStep/' + flowId, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getStageByStudent(studentId: string): Observable<any> {
    return this.http.get(environment.apiURL + 'userFlow/stagesByStudent/' + studentId, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getStage(id: string) {
    return this.http.get(this.uri+id, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  postStage(stage: any) {
    return this.http.post(this.uri, stage, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  putStage(id: string, updatedStage: any): Observable<any> {
    return this.http.put(this.uri+id, updatedStage, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  deleteStage(id: string): Observable<any> {
    return this.http.delete(this.uri+id, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  updateProgress(studentId: string, flowId:string, externalId:string, percentage: number): Observable<any> {
    return this.http.put(environment.apiURL + 'userFlow/updateProgress/' + studentId + '/' + flowId + '/' + externalId + '/' + percentage, {}, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

}
