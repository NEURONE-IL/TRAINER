import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Stage {
  _id: string,
  title: string,
  description: string,
  step: number,
  study: number,
  type: string,
  link: string,
  createdAt: string,
  updatedAt: string  
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

  getStagesByStudy(studyId: string): Observable<any> {
    return this.http.get(environment.apiURL +'stage/byStudy/'+studyId, { headers: {'x-access-token': localStorage.getItem('auth_token')} })
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

}