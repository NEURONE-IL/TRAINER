import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlowsSearchResultsComponent } from '../flows-search-results/flows-search-results.component';
@Component({
  selector: 'app-flows-search',
  templateUrl: './flows-search.component.html',
  styleUrls: ['./flows-search.component.css']
})
export class FlowsSearchComponent implements OnInit {
  name: string;
  search : string = "";
  resultsComponent: FlowsSearchResultsComponent;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  
  onActivate(componentReference) {
    this.resultsComponent = componentReference;
  }

}
