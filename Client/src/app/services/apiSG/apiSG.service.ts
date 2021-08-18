import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

export interface SGGame {
  _id: string;
  name: string;
  description: string;
  domain: string;
  gm_code: string;
  createdAt: string;
  updatedAt: string;
  image_id: string;
  image_url: string;
}

@Injectable({
  providedIn: 'root'
})

export class ApiSGService {
  urlLocal = 'http://localhost:4200/';
  urlApi = 'http://143.198.136.174:3002/';
  apiKey = 'wxlsdn2i3fviyqff31nw6dsvqxolka';

  uri = environment.apiURL + 'sg/';

  constructor(private http: HttpClient,
              private router: Router,
              private toastr: ToastrService,
              private translate: TranslateService) {}


  getApiKey() {
    const post = {site: this.urlLocal};
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    this.http.post(this.urlApi + 'register', post, {headers: header}).subscribe((res: any) => {
      this.apiKey = res.site.api_key;
      this.toastr.success('Se ha establecido la coneccion con SG', 'Coneccion Exitosa!');
    });
  }

  getStudies() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('x-api-key', this.apiKey);
    return this.http.get(this.urlApi + 'api/site/adventure', {headers: header});
  }

  getAdventureLink(idAdventure) {
    const user = JSON.parse(localStorage.getItem('currentUser', ));
    return 'http://143.198.136.174:3030/login_redirect/' + user.email + '/' + user.names + '/' + idAdventure + '/' + user._id + '/' + this.apiKey + '/http:--localhost:4200-home';
  }

}
