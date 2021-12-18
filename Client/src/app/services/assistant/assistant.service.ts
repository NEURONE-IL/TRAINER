import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  urlApi = 'http://va.neurone.info/api/';

  constructor(private http: HttpClient) { }

  getAssistants() {
    return this.http.get(this.urlApi + 'assistant');
  }

}
