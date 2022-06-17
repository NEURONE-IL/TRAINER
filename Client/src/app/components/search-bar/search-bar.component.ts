import { Component, OnInit, Injector, Input } from '@angular/core';
import { Router} from '@angular/router';
import { FlowsSearchResultsComponent } from 'src/app/views/flows-search-results/flows-search-results.component';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  name: string;
  search : string = "";
  resultsComponent: FlowsSearchResultsComponent;
  @Input() componentReference: any;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }
  getPublicAdventures(param: string){
    this.router.navigate(['flows-search/results/'+param]);
  }
  async searchFlows(query: string){
    
    this.router.navigate(['flows-search/results/'+query]);

    if(this.componentReference){
      this.name = this.componentReference.route.url.value[0].path;
      if (this.name === 'results'){
        this.resultsComponent = this.componentReference;
        if(query === '' || query === null )
          query = 'all'
        this.resultsComponent.getPublicStudies(query);
      }
    }
    
    this.search = "";
  }
  onActivate(componentReference) {
    this.name = componentReference.route.url.value[0].path;
    if (this.name === 'results'){
      this.resultsComponent = componentReference;
    }
  }

}
