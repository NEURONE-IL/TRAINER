import { Component, OnInit, SimpleChanges } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-video-only',
  templateUrl: './video-only.component.html',
  styleUrls: ['./video-only.component.css']
})
export class VideoOnlyComponent implements OnInit {

  constructor( private activatedRoute: ActivatedRoute ) { }
  idNumber;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const id = params.id;
      console.log(id);
      this.idNumber = id;
    });
  }
}
