import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../productor-statement/pages/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { StatementsComponent } from './pages/statements/statements.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FaqComponent } from 'src/app/shared/components/faq/faq.component';

const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: 
  [
    { path: 'home', component: HomeComponent },
    { path: 'statements', component: StatementsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'faq', component: FaqComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerStatementRoutingModule { }
