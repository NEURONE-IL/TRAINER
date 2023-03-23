import { Component, OnInit,Output,ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FlowSearchService } from 'src/app/services/admin/flow-search.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FlowService, Flow } from 'src/app/services/trainer/flow.service';

export interface Paginator {
  totalDocs: number,
  perPages: number,
}

@Component({
  selector: 'app-flows-search-results',
  templateUrl: './flows-search-results.component.html',
  styleUrls: ['./flows-search-results.component.css']
})
export class FlowsSearchResultsComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private flowService: FlowService,
    private flowSearchService: FlowSearchService,
    private toastr: ToastrService,
    private translate: TranslateService,) { }

  actualQuery: string = "";
  flows: Flow[] = [];
  paginator: Paginator = {
    totalDocs: 8,
    perPages: 8,
  }
  pageEvent: PageEvent;
  filters: any = {competences:[], levels: [], languages:[]};
  allFilters: any = {competences:[], levels: [], languages:[]};

  ngOnInit(): void {
    let searchTerm = this.route.snapshot.paramMap.get('term');
    this.getFlowsResults(searchTerm, 1);
  }

  getFlowsResults(searchTerm, page) {
    this.actualQuery = searchTerm;
    let _user_id = this.authService.getUser()._id
    this.flowSearchService.searchFlows(_user_id, searchTerm, page,{filters:this.filters, allFilters:this.allFilters}).subscribe(
      response => {
        let flows: Flow[] = []
        this.paginator.totalDocs = parseInt(response.totalDocs);
        let docs = response.docs
        console.log(docs)
        docs.forEach(doc => { flows.push(doc.flow) })
        this.flows = flows;
      },
      err => {
        this.toastr.error(this.translate.instant("STUDY.TOAST.NOT_LOADED_MULTIPLE_ERROR"), this.translate.instant("CHALLENGE.TOAST.ERROR"), {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }

  @ViewChild('flowsPaginator') flowsPaginator: MatPaginator;
  pageTurn(event) {
    this.getFlowsResults(this.actualQuery, event.pageIndex + 1)
  }

  getPublicStudies(term: string, filters: any, allFilters: any) {

    this.router.navigate(['flows-search/results/' + term]);

    if (this.flowsPaginator !== undefined)
      this.flowsPaginator.firstPage();

    this.filters = filters;
    this.allFilters = allFilters;
    this.getFlowsResults(term, 1)

  }
  getCurrentQuery(filters: any, allFilters: any) {

    if (this.flowsPaginator !== undefined)
      this.flowsPaginator.firstPage();

    this.filters = filters;
    this.allFilters = allFilters;
    this.getFlowsResults(this.actualQuery, 1)

  }

  clickedFlow(id){
    let link = '/flows-search/flow/' + id;
    this.router.navigate([link]);
  }

  actualFlow='';

  fullFlow(flow){
    this.actualFlow = flow._id;
  }

  shortFlow(flow){
    this.actualFlow= '';
  }

  showShortDescription(description){
    return (description.substr(0, 40));
  }
  getCover(index: number): string{
    return '../../../assets/flow-images/Flow0' + (index%8+1) + '.jpg';
  }

}
