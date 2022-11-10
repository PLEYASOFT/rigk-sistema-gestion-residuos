import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path: 'productor',
    canActivate: [],
    loadChildren: () => import('./modules/productor-statement/productor-statement.module').then(m=>m.ProductorStatementModule),

  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
