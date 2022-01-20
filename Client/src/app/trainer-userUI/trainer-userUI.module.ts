import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlujosComponent } from './pages/flujos/flujos.component';
import { ModulosComponent } from './pages/modulos/modulos.component';
import { EtapasComponent } from './pages/etapas/etapas.component';

import { MaterialAngularModule } from '../material-angular/material-angular.module';
import { DescriptionDialogComponent } from './components/description-dialog/description-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [
    FlujosComponent,
    ModulosComponent, 
    EtapasComponent,
    DescriptionDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialAngularModule,
    FlexLayoutModule,
    NgCircleProgressModule.forRoot({
      "radius": 60,
      "space": -10,
      "outerStrokeGradient": true,
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#4882c2",
      "outerStrokeGradientStopColor": "#53a9ff",
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 10,
      "animateTitle": false,
      "animationDuration": 500,
      "showBackground": false,
      "clockwise": false,
      "startFromZero": false,
      "showSubtitle": false
    })
  ],
  exports:[
    FlujosComponent,
    ModulosComponent
  ]
})
export class TrainerUserUIModule { }
