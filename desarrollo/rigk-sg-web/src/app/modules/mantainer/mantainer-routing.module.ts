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
  { path: 'faq', component: FaqComponent },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }]
}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantainerRoutingModule { }
