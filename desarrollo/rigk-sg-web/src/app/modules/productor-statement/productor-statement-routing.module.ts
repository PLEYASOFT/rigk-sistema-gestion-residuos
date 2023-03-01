import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './pages/form/form.component';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StatementsComponent } from './pages/statements/statements.component';
import { SummaryStatementComponent } from './components/summary-statement/summary-statement.component';
import { FaqComponent } from 'src/app/shared/components/faq/faq.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'form', component: FormComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'statements', component: StatementsComponent },
      { path: 'summary', component: SummaryStatementComponent },
      { path: 'faq', component: FaqComponent },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductorStatementRoutingModule { }
