import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../productor-statement/pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { MaintainerBusinessComponent } from './pages/maintainer-business/maintainer-business.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MaintainerEstablishmentComponent } from './pages/maintainer-establishment/maintainer-establishment.component';
import { MantainerUsersComponent } from './pages/mantainer-users/mantainer-users.component';
import { FaqComponent } from 'src/app/shared/components/faq/faq.component';
import { MaintainerDeclarationsProductorComponent } from './pages/maintainer-declarations-productor/maintainer-declarations-productor.component';
import { MaintainerManagersComponent } from './pages/maintainer-managers/maintainer-managers.component';
import { LogsComponent } from './pages/logs/logs.component';
import { MaintainerRatesComponent } from './pages/maintainer-rates/maintainer-rates.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MaintainerGoalsComponent } from './pages/maintainer-goals/maintainer-goals.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children:[
  { path: 'home', component:  HomeComponent},
  { path: 'profile', component: ProfileComponent },
  { path: 'business', component: MaintainerBusinessComponent },
  { path: 'establishment', component: MaintainerEstablishmentComponent },
  { path: 'users', component: MantainerUsersComponent },
  { path: 'declarations', component: MaintainerDeclarationsProductorComponent },
  {path: 'algo', component: MaintainerRatesComponent },
  {path: 'goals', component: MaintainerGoalsComponent},
  { path: 'faq', component: FaqComponent },
  { path: 'managers', component: MaintainerManagersComponent },
  { path: 'logs', component: LogsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }]
}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantainerRoutingModule { }
