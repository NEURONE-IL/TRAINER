import { Component, OnInit, Injector, Input } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { FlowsSearchResultsComponent } from 'src/app/views/flows-search-results/flows-search-results.component';
import { FlowResourcesService } from 'src/app/services/admin/flow-resources.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  name: string;
  search : string = "";
  levels: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  languages : any[];
  competences: any[];
  resultsComponent: FlowsSearchResultsComponent;

  levelsSelected: string[] = [];
  languagesSelected : any[] = []
  competencesSelected: any[] = [];
  notFilter:boolean = true;
  allFilters: any = {competences:[], languages:[] , levels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']};
  
  @Input() results: any[];
  @Input() componentReference: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private flowResourcesService: FlowResourcesService,
  ) { }

  ngOnInit(): void {
    let path = this.router.routerState.snapshot.url.split('/')[2]
    if (path === 'results')
      this.name = path 

      this.flowResourcesService.getCompetences().subscribe( response => {
      this.competences = response.competences;
      this.competences.sort( (a,b) => a.name.localeCompare(b.name))
      this.competences.forEach(el => this.allFilters.competences.push(el.name));
    }, err => {
      console.log(err)
    });

    this.flowResourcesService.getLanguages().subscribe( response => {
      this.languages = response.languages;
      this.languages.sort( (a,b) => a.name.localeCompare(b.name))
      this.languages.forEach(el => this.allFilters.languages.push(el.name));

    }, err => {
      console.log(err)
    });
    
  }
  getPublicAdventures(param: string){
    this.router.navigate(['flows-search/results/'+param]);
  }
  async searchFlows(query: string){
    this.name = 'results';

    if(query === '' || query === null || query === undefined )
      query = 'all'
    this.router.navigate(['flows-search/results/'+query]);

    if(this.componentReference){
      this.name = this.componentReference.route.url.value[0].path;
      if (this.name === 'results'){
        this.resultsComponent = this.componentReference;
        let currentFilters = {competences: this.competencesSelected, levels:this.levelsSelected, languages:this.languagesSelected}
        this.resultsComponent.getPublicStudies(query,currentFilters, this.allFilters);
      }
    }
    
    this.search = "";
  }
  filterFlows(filter){
    let currentFilters: any
    if(filter){
      currentFilters = {competences: this.competencesSelected, levels:this.levelsSelected, languages:this.languagesSelected}
    }
    else{
      currentFilters = {competences: [], levels:[], languages:[]}

    }
    if(this.componentReference){
      this.name = this.componentReference.route.url.value[0].path;
      if (this.name === 'results'){
        this.resultsComponent = this.componentReference;
        this.resultsComponent.getCurrentQuery(currentFilters, this.allFilters);
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
  addCompetence($event){
    let value = $event.source.value
    if($event.checked)
      this.competencesSelected.push(value);

    else{
      let index = this.competencesSelected.findIndex( comp => comp._id === value);
      this.competencesSelected.splice(index,1)
    }
    console.log(this.competencesSelected)
  }
  addLevel($event){
    let value = $event.source.value
    if($event.checked)
      this.levelsSelected.push(value);

    else{
      let index = this.levelsSelected.findIndex( lvl => lvl === value);
      this.levelsSelected.splice(index,1)
    }
    console.log(this.levelsSelected)
  }
  addLanguage($event){
    let value = $event.source.value
    if($event.checked)
      this.languagesSelected.push(value);

    else{
      let index = this.languagesSelected.findIndex( lang => lang._id === value);
      this.languagesSelected.splice(index,1)
    }
    console.log(this.languagesSelected)
  }

}
