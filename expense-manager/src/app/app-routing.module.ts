import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthGuard } from './guard/auth.guard';
import { RevGuardGuard } from './guard/rev-guard.guard';
import { MyexpenseComponent } from './myexpense/myexpense.component';

const routes: Routes = [
  {path : '',component:AuthenticationComponent, canActivate : [RevGuardGuard]},
  {path : 'dashboard',component:DashboardComponent, canActivate : [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
