import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from '../productor-statement/pages/layout/layout.component';
import { FormComponent } from './pages/form/form.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StatementsComponent } from './pages/statements/statements.component';

const routes: Routes = [{
    path: '',
    component: LayoutComponent,
    children: 
    [
      { path: 'home', component: HomeComponent },
      { path: 'form', component: FormComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'statements', component: StatementsComponent },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerStatementRoutingModule { }