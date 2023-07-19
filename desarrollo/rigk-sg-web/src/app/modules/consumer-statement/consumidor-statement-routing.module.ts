import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from 'src/app/shared/components/faq/faq.component';
import { LayoutComponent } from '../productor-statement/pages/layout/layout.component';
import { FormComponent } from './pages/form/form.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StatementsComponent } from './pages/statements/statements.component';
import { BulkUploadComponent } from './pages/bulk-upload/bulk-upload.component';
import { StatementsDetailComponent } from './pages/statements-detail/statements-detail.component';

const routes: Routes = [{
    path: '',
    component: LayoutComponent,
    children: 
    [
      { path: 'home', component: HomeComponent },
      { path: 'bulk-upload', component: BulkUploadComponent },
      { path: 'form', component: FormComponent, data: {show:false} },
      { path: 'form/:id', component: FormComponent, data:{show: true} },
      { path: 'profile', component: ProfileComponent },
      { path: 'statements', component: StatementsComponent },
      { path: 'statements/:id_header_/:id_detail', component: StatementsDetailComponent },
      { path: 'faq', component: FaqComponent },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerStatementRoutingModule { }