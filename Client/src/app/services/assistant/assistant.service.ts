import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  urlApi = environment.adventureApi;

  constructor(private http: HttpClient) { }

  getAssistants() {
    return this.http.get(this.urlApi + 'assistant');
  }

}
