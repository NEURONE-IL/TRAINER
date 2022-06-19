import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompetenceService {

  uri = environment.apiURL + 'competence/';
  constructor(protected http: HttpClient) { }

  getCompetences(): Observable<any>{
    return this.http.get(this.uri);
  }
}
