import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
//import { NotLoggedInGuard } from './helpers/not-logged-in.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
    //canActivate: [ NotLoggedInGuard ]
  },
  {
    path: 'home',
    component: HomeComponent,
    //canActivate: [ NotLoggedInGuard ]
  },
  /*
  {
    path: 'login/confirmedOK',
    component: LoginComponent,
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
  },*/
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }