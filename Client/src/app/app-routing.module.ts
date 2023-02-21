import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterStudentComponent } from './views/registerStudent/registerStudent.component';
import { StudentLandPageComponent } from './views/studentLandPage/studentLandPage.component';
import { RegisterAdminComponent } from './views/registerAdmin/registerAdmin.component';
import { AdminPanelComponent } from './views/admin-panel/admin-panel.component';
import { FlowsDisplayComponent } from './views/flows-display/flows-display.component';
import { FlowDisplayComponent } from './views/flow-display/flow-display.component';
import { RecoveryComponent } from './views/recovery/recovery.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ApiConfigurationComponent } from './views/apiConfiguration/apiConfiguration.component';
import { FlowCreationComponent } from './views/flow-creation/flow-creation.component';
import { AuthGuard } from './helpers/auth.guard';
import { AdminGuard } from './helpers/admin.guard';
import { NotLoggedInGuard } from './helpers/not-logged-in.guard';
import { VideoModuleComponent } from './views/videoModule/videoModule.component';
import { VideoOnlyComponent } from './views/video-only/video-only.component';
import { SignupComponent } from './views/signup/signup.component';
import { AdminVideoModuleComponent } from './views/videoModule-admin/videoModule-admin.component';

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
    path: 'login/confirmedOK',
    component: LoginComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'login/alreadyConfirmed',
    component: LoginComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [ NotLoggedInGuard ]
  },
/*
  {
    path: 'signup/:flow_id',
    component: SignupComponent,
    canActivate: [ NotLoggedInGuard ]
  },
*/
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
    canActivate: [ AuthGuard]
  },
  {
    path: 'video',
    component: VideoOnlyComponent,
    canActivate: [ AuthGuard ]
  },
  {
    path: 'admin_videoModule',
    component: AdminVideoModuleComponent,
    canActivate: [ AuthGuard ]
  },
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
        path: 'flows',
        component: FlowsDisplayComponent
      },
      {
        path: 'flow/:flow_id',
        component: FlowDisplayComponent
      },
    ]
  },
  {
    path: 'create-flow',
    component: FlowCreationComponent,
    canActivate: [ AuthGuard, AdminGuard ]
  },
  {
    path: 'forgot_password',
    component: ForgotPasswordComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'user/resetPassword/:token',
    component: RecoveryComponent,
    canActivate: [ NotLoggedInGuard ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
