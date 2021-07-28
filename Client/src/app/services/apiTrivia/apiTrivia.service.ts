import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class ApiTriviaService {
  urlLocal = 'http://localhost:4200/';
  urlApi = 'http://159.65.100.191:3030/api/';
  apiKey = 't4u9x30msmmiq56m5rhmtf9fn3r1lk';

  uri = environment.apiURL + 'trivia/';

  constructor(private http: HttpClient,
              private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService) {}


  getApiKey() {
    const post = {site: this.urlLocal};
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    this.http.post(this.urlApi + 'site/register', post, {headers: header}).subscribe((res: any) => {
      this.apiKey = res.site.api_key;
      this.toastr.success('Se ha establecido la coneccion con Trivia', 'Coneccion Exitosa!')
    });
  }

  getStudies() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('x-api-key', this.apiKey);
    return this.http.get(this.urlApi + 'site/study', {headers: header});
  }


}
