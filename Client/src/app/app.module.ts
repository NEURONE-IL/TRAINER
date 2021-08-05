import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule} from '@angular/material/paginator';
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

import { PdfViewerModule }  from  'ng2-pdf-viewer';
import { Ng9RutModule } from 'ng9-rut';
import { ValidateEqualModule } from 'ng-validate-equal';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


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
import { StudiesDisplayComponent } from './views/studies-display/studies-display.component';
import { StudyCreationComponent } from './views/study-creation/study-creation.component';
import { StudyDisplayComponent } from './views/study-display/study-display.component';
import { StageCreationComponent } from './views/stage-creation/stage-creation.component';
import { VideoModuleComponent } from './views/videoModule/videoModule.component';
import { VideoComponent } from './components/video/video.component';
import { QuizComponent } from './components/quiz/quiz.component';


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
    StudiesDisplayComponent,
    StudyCreationComponent,
    StudyDisplayComponent,
    StageCreationComponent,    
    VideoModuleComponent,
    VideoComponent,
    QuizComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
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
    MatListModule,
    MatSelectModule,
    MatDialogModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatTooltipModule,
    PdfViewerModule,
    Ng9RutModule,
    ValidateEqualModule,
    CommonModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    NgbModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
