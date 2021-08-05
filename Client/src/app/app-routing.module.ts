import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterStudentComponent } from './views/registerStudent/registerStudent.component';
import { StudentLandPageComponent } from './views/studentLandPage/studentLandPage.component';
import { RegisterAdminComponent } from './views/registerAdmin/registerAdmin.component';
import { AdminPanelComponent } from './views/admin-panel/admin-panel.component';
import { StudiesDisplayComponent } from './views/studies-display/studies-display.component';
import { StudyDisplayComponent } from './views/study-display/study-display.component';
import { RecoveryComponent } from './views/recovery/recovery.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ApiConfigurationComponent } from './views/apiConfiguration/apiConfiguration.component';
import { StudyCreationComponent } from './views/study-creation/study-creation.component';
import { AuthGuard } from './helpers/auth.guard';
import { AdminGuard } from './helpers/admin.guard';
import { NotLoggedInGuard } from './helpers/not-logged-in.guard';
import { VideoModuleComponent } from './views/videoModule/videoModule.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'register',
    component: RegisterStudentComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'registerAdmin',
    component: RegisterAdminComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'homeStudent',
    component: StudentLandPageComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'apiConfig',
    component: ApiConfigurationComponent,
    canActivate: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'videoModule',
    component: VideoModuleComponent,
    canActivate: [ AuthGuard ]
  },
  /*
  {
    path: 'login/confirmedOK',
    component: StudentLandPageComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  */
  {
    path: 'admin_panel',
    component: AdminPanelComponent,
    canActivate: [ AuthGuard, AdminGuard ],
    children: [
      {
        path: 'studies',
        component: StudiesDisplayComponent
      },
      {
        path: 'study/:study_id',
        component: StudyDisplayComponent
      },
    ]
  },
  {
    path: 'create-study',
    component: StudyCreationComponent,
    canActivate: [ AuthGuard, AdminGuard ]
  },  
  
  
  /*
  {
    path: 'forgot_password',
    component: ForgotPasswordComponent,
//    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'user/resetPassword/:token',
    component: RecoveryComponent,
//    canActivate: [ NotLoggedInGuard ]
  },
  { path: '**', redirectTo: 'home' },*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
