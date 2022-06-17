import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlowSearchService {
  uri = environment.apiURL + 'flowSearch/';
  constructor(protected http: HttpClient) { }

  searchFlows(user_id: string, query: string, page: number): Observable<any>{
    return this.http.get(this.uri +'search/'+user_id+'/'+query+'/'+page);
  }
}
