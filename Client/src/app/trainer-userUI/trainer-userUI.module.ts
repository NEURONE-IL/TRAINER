//Modulo relacionado a las interfaces de cara al usuario, reemplazando las funcionalidades de home, show-flow y show-stages.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlujosComponent } from './pages/flujos/flujos.component';
import { ModulosComponent } from './pages/modulos/modulos.component';
import { EtapasComponent } from './pages/etapas/etapas.component';

import { DescriptionDialogComponent } from './components/description-dialog/description-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { TipoEtapaPipe } from './pipes/tipo-etapa.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MedalDialogComponent } from './components/medal-dialog/medal-dialog.component';
import { TimerDialogComponent } from './components/timer-dialog/timer-dialog.component';
import { MedalShowcaseComponent } from './components/medal-showcase/medal-showcase.component';

@NgModule({
  declarations: [
    FlujosComponent,
    ModulosComponent, 
    EtapasComponent,
    DescriptionDialogComponent,
    TipoEtapaPipe,
    MedalDialogComponent,
    TimerDialogComponent,
    MedalShowcaseComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,

    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,

    TranslateModule,

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
