import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterStudentComponent } from './views/registerStudent/registerStudent.component';
import { StudentLandPageComponent } from './views/studentLandPage/studentLandPage.component';
import { RegisterAdminComponent } from './views/registerAdmin/registerAdmin.component';
import { RecoveryComponent } from './views/recovery/recovery.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ApiConfigurationComponent } from './views/apiConfiguration/apiConfiguration.component';
import { VideoModuleComponent } from './views/videoModule/videoModule.component';
// import { NotLoggedInGuard } from './helpers/not-logged-in.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'register',
    component: RegisterStudentComponent,
    // canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'registerAdmin',
    component: RegisterAdminComponent,
    // canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'homeStudent',
    component: StudentLandPageComponent,
    // canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'home',
    component: HomeComponent,
    // canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'apiConfig',
    component: ApiConfigurationComponent,
    // canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'videoModule',
    component: VideoModuleComponent,
    // canActivate: [ NotLoggedInGuard ]
  },
  /*
  {
    path: 'login/confirmedOK',
    component: StudentLandPageComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'admin_panel',
    component: AdminPanelComponent,
    canActivate: [ AuthGuard, AdminGuard ],
    children: [
      {
        path: 'studies',
        component: StudiesDisplayComponent,
        //canActivate: [ AuthGuard, AdminGuard ],
      },
      {
        path: 'study/:study_id',
        component: StudyDisplayComponent,
        //canActivate: [ AuthGuard, AdminGuard ],
      },
    ]
  },*/
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
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
