import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorldComponent } from './world/world.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/auth.component';


const routes: Routes = [
  {
     path: '',
     redirectTo: 'app-world',
     pathMatch: 'full'
  },
  {
    path: 'app-world',
    component: WorldComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'app-login',
    component: AuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
