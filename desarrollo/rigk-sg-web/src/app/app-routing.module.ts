import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ConsumerStatementModule } from './modules/consumer-statement/consumer-statement.module';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path: 'productor',
    canActivate: [AuthGuard],
    data: { rolesPermitidos: ['9'] },
    loadChildren: () => import('./modules/productor-statement/productor-statement.module').then(m => m.ProductorStatementModule),
  },
  {
    path: 'mantenedor',
    canActivate: [AuthGuard],
    data: { rolesPermitidos: ['10'] },
    loadChildren: () => import('./modules/mantainer/mantainer.module').then(m=>m.MantainerModule)
  },
  {
    path: 'consumidor',
    canActivate: [AuthGuard],
    data: { rolesPermitidos: ['11'] },
    loadChildren: () => import('./modules/consumer-statement/consumer-statement.module').then(m=>m.ConsumerStatementModule)
  },
  {
    path: 'gestor',
    canActivate: [AuthGuard],
    data: { rolesPermitidos: ['12'] },
    loadChildren: () => import('./modules/manager-statement/manager-statement.module').then(m=>m.ManagerStatementModule)
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
