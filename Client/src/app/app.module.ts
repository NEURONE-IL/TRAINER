import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatChipsModule} from '@angular/material/chips'; 
import {MatButtonToggleModule} from '@angular/material/button-toggle'


import { PdfViewerModule }  from  'ng2-pdf-viewer';
import { Ng9RutModule } from 'ng9-rut';
import { ValidateEqualModule } from 'ng-validate-equal';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PlyrModule } from 'ngx-plyr';

import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterStudentComponent } from './views/registerStudent/registerStudent.component';
import { StudentLandPageComponent } from './views/studentLandPage/studentLandPage.component';
import { RegisterAdminComponent } from './views/registerAdmin/registerAdmin.component';
import { HeaderComponent } from './components/header/header.component';
import { RecoveryComponent } from './views/recovery/recovery.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ApiConfigurationComponent } from './views/apiConfiguration/apiConfiguration.component';
import { AdminPanelComponent } from './views/admin-panel/admin-panel.component';
import { FlowsDisplayComponent } from './views/flows-display/flows-display.component';
import { FlowCreationComponent } from './views/flow-creation/flow-creation.component';
import { FlowDisplayComponent } from './views/flow-display/flow-display.component';
import { StageCreationComponent } from './views/stage-creation/stage-creation.component';
import { VideoModuleComponent } from './views/videoModule/videoModule.component';
import { VideoComponent } from './components/video/video.component';
import { VideoOnlyComponent } from './views/video-only/video-only.component';
import { ShowFlowComponent, DescriptionDialogComponent } from './components/show-flow/show-flow.component';
import { QuizComponent } from './components/quiz/quiz.component';
import {QuizMantainerComponent} from './components/quiz-mantainer/quiz-mantainer.component';
import {VideoMantainerComponent} from './components/video-mantainer/video-mantainer.component';
import { SignupComponent } from './views/signup/signup.component';
import { ConsentComponent } from './components/consent/consent.component';
import { ModuleCreationComponent } from './views/module-creation/module-creation.component';
import { ShowStagesComponent } from './views/show-stages/show-stages.component';
import { AdminVideoModuleComponent } from './views/videoModule-admin/videoModule-admin.component';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { SafeurlPipe } from './services/assistant/safeurl.pipe';
import { TrainerUserUIModule } from './trainer-userUI/trainer-userUI.module';
import { FlowUpdateComponent } from './views/flow-update/flow-update.component';
import { StageUpdateComponent } from './views/stage-update/stage-update.component';
import { ModuleUpdateComponent } from './views/module-update/module-update.component';
import { FooterComponent } from './components/footer/footer.component';

import { authInterceptorProviders } from './helpers/auth.interceptor';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { FlowsSearchComponent } from './views/flows-search/flows-search.component';
import { FlowsSearchResultsComponent } from './views/flows-search-results/flows-search-results.component';
import { getDutchPaginatorIntl } from './components/paginatorInt/CustomPaginatorConfiguration';
import { FlowSearchDisplayComponent } from './views/flow-search-display/flow-search-display.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ApiConfigurationComponent,
    RegisterStudentComponent,
    StudentLandPageComponent,
    RegisterAdminComponent,
    HeaderComponent,
    RecoveryComponent,
    ForgotPasswordComponent,
    AdminPanelComponent,
    StageCreationComponent,
    VideoModuleComponent,
    VideoOnlyComponent,
    ShowFlowComponent,
    DescriptionDialogComponent,
    VideoComponent,
    QuizComponent,
    QuizMantainerComponent,
    VideoMantainerComponent,
    SignupComponent,
    ConsentComponent,
    ModuleCreationComponent,
    FlowsDisplayComponent,
    FlowUpdateComponent,
    StageUpdateComponent,
    FlowCreationComponent,
    FlowDisplayComponent,
    ShowStagesComponent,
    SafeurlPipe,
    AdminVideoModuleComponent,
    ModuleUpdateComponent,
    FooterComponent,
    SearchBarComponent,
    FlowsSearchComponent,
    FlowsSearchResultsComponent,
    FlowSearchDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    MatBadgeModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatCardModule,
    MatRadioModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCheckboxModule,
    MatStepperModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatListModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatButtonToggleModule,
    PdfViewerModule,
    Ng9RutModule,
    ValidateEqualModule,
    CommonModule,
    PlyrModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    NgbModule,
    NgCircleProgressModule,
    TrainerUserUIModule
  ],
  providers:[authInterceptorProviders, { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }],
  bootstrap: [AppComponent]
})
export class AppModule { }
