import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface Study {
  _id: string,
  name: string,
  description: string,
  domain: string,
  type: string, 
  image_url: string,
  image_id: string
}

@Injectable({
  providedIn: 'root'
})
export class StudyService {

  uri = environment.apiURL + 'study/';

  constructor(protected http: HttpClient) { }

  getStudies(): Observable<any> {
    return this.http.get(this.uri, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getStudy(id: string): Observable<any> {
    return this.http.get(this.uri+id);
  }

  deleteStudy(id: string): Observable<any> {
    return this.http.delete(this.uri+id);
  }

  postStudy(study: any): Observable<any> {
    return this.http.post(this.uri, study, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  putStudy(studyId: string, updatedStudy: any): Observable<any> {
    return this.http.put(this.uri+studyId, updatedStudy, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
}