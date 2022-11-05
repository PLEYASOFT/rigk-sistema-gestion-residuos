import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormComponent } from './pages/form/form.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'formulario', component: FormComponent },
      { path: '**', redirectTo: 'formulario', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductorStatementRoutingModule { }
