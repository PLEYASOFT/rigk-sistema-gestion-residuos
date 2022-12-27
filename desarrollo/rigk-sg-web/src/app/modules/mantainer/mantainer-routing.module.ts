import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../productor-statement/pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { MaintainerBusinessComponent } from './pages/maintainer-business/maintainer-business.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children:[
  { path: 'home', component:  HomeComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'business', component: MaintainerBusinessComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }]
}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantainerRoutingModule { }
