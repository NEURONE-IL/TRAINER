import { Component, Input, OnInit } from '@angular/core';
import { Stage, StageService } from 'src/app/services/trainer/stage.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'show-stages',
  templateUrl: './show-stages.component.html',
  styleUrls: ['./show-stages.component.css']
})
export class ShowStagesComponent implements OnInit {

  constructor(
    private stageService: StageService,
  ) {}

  stagesByModule: Stage[] = [];

  @Input() modulo: any;

  @Output() eventoVolver = new EventEmitter<any>();

  ngOnInit(): void {
    this.stagesByModule=this.modulo.stages;
  }

  volver(){
    this.eventoVolver.emit();
  }

}
