import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorldComponent } from './world/world.component';


const routes: Routes = [
  {
     path: '',
     redirectTo: 'app-world',
     pathMatch: 'full'
  },
  {
    path: 'app-world',
    component: WorldComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
