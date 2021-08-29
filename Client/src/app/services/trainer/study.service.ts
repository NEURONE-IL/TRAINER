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

  getStudyDummy(studyId: string): Observable<any> {
    return this.http.get(environment.apiURL + 'user/' + studyId +'/findTestUser', { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }
  getStudies(): Observable<any> {
    return this.http.get(this.uri, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getStudy(id: string): Observable<any> {
    return this.http.get(this.uri+id, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  deleteStudy(id: string): Observable<any> {
    return this.http.delete(this.uri+id, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  postStudy(study: any): Observable<any> {
    return this.http.post(this.uri, study, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  putStudy(studyId: string, updatedStudy: any): Observable<any> {
    return this.http.put(this.uri+studyId, updatedStudy, { headers: {'x-access-token': localStorage.getItem('auth_token')} });
  }

  getStudySignup(id: string): Observable<any> {
    return this.http.get(this.uri+id+'/getForSignup');
  }
}
