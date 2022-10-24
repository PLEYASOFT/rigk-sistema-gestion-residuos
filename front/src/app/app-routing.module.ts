import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CheckRolGuard } from './core/guards/check-rol.guard';
import { ConsultaAlertaTransferenciaComponent } from './modules/consulta-alerta-traansferencia/pages/consulta-alerta-transferencia/consulta-alerta-transferencia.component';
import { ConsultaCasillaCcaComponent } from './modules/consulta-casilla-cca/pages/consulta-casilla-cca/consulta-casilla-cca.component';
import { ConsultaCcaCopiaComponent } from './modules/consulta-cca-copia/pages/consulta-cca-copia/consulta-cca-copia.component';
import { ConsultaContingenciaCasillaStiComponent } from './modules/consulta-contingencia-casilla-STI/pages/consulta-contingencia-casilla-sti/consulta-contingencia-casilla-sti.component';
import { ConsultaContingenciaStarAchComponent } from './modules/consulta-contingencia-StarAch/pages/consulta-contingencia-StarAch/consulta-contingencia-StarAch.component';
import { ConsultaContingenciasComponent } from './modules/consulta-contingencias/pages/consulta-contingencias/consulta-contingencias.component';
import { ConsultaTefComponent } from './modules/consulta-tef/pages/consulta-tef/consulta-tef.component';
import { ConsultaTranferenciaComponent } from './modules/consulta-transferencia/pages/consulta-tranferencia/consulta-tranferencia.component';
import { HomeComponent } from './modules/home/pages/home/home.component';
import { MantenedorBancoComponent } from './modules/mantenedor-bancos/pages/mantenedor-banco/mantenedor-banco.component';
import { MantenedorContingenciaStarachComponent } from './modules/mantenedor-contingencias-starach/pages/mantenedor-contingencia-starach/mantenedor-contingencia-starach.component';
import { MantenedorTipoArchivoComponent } from './modules/mantenedor-tipo-de-archivo/pages/mantenedor-tipo-archivo/mantenedor-tipo-archivo.component';
import { MonitorCasillaCcaComponent } from './modules/monitor-casilla-cca/pages/monitor-casilla-cca/monitor-casilla-cca.component';
import { MonitorCopiaComponent } from './modules/monitor-copia/pages/monitor-copia/monitor-copia.component';
import { MonitorIntegradoComponent } from './modules/monitor-integrado/pages/monitor-integrado/monitor-integrado.component';
import { MonitorTefComponent } from './modules/monitor-tef/pages/monitor-tef/monitor-tef.component';
import { MonitorTransferenciaComponent } from './modules/monitor-transferencia/pages/monitor-transferencia/monitor-transferencia.component';

const routes: Routes = [
  {
    path: 'monitor-tef-tgr',
    component: MonitorTefComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Operador CCA', 'Administrador CCA'],
    },
  },
  {
    path: 'monitor-transferencia',
    component: MonitorTransferenciaComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Operador CCA', 'Administrador CCA'],
    },
  },
  {
    path: 'monitor-copia',
    component: MonitorCopiaComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Operador CCA', 'Administrador CCA'],
    },
  },
  {
    path: 'monitor-integrado',
    component: MonitorIntegradoComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Operador CCA', 'Administrador CCA'],
    },
  },
  {
    path: 'monitor-casilla-cca',
    component: MonitorCasillaCcaComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Operador CCA', 'Administrador CCA'],
    },
  },
  {
    path: 'consulta-tranferencia',
    component: ConsultaTranferenciaComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Administrador CCA', 'Operador CCA'],
    },
  },
  {
    path: 'consulta-cca-copia',
    component: ConsultaCcaCopiaComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Administrador CCA', 'Operador CCA'],
    },
  },
  {
    path: 'consulta-alerta-transferencia',
    component: ConsultaAlertaTransferenciaComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Operador CCA', 'Administrador CCA'],
    },
  },
  {
    path: 'consulta-tef',
    component: ConsultaTefComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Operador CCA', 'Administrador CCA'],
    },
  },
  /*  {
    path: 'consulta-contingencias',
    component: ConsultaContingenciasComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Operador CCA'],
    },
  }, */
  {
    path: 'consulta-contingencia-starach',
    component: ConsultaContingenciaStarAchComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Administrador CCA', 'Operador CCA'],
    },
  },
  {
    path: 'consulta-contingencia-casilla-sti',
    component: ConsultaContingenciaCasillaStiComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Administrador CCA', 'Operador CCA'],
    },
  },
  {
    path: 'consulta-casilla-cca',
    component: ConsultaCasillaCcaComponent,

    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Administrador CCA', 'Operador CCA'],
    },
  },
  {
    path: 'mantenedor-banco',
    component: MantenedorBancoComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Administrador CCA'],
    },
  },
  {
    path: 'mantenedor-tipo-de-archivo',
    component: MantenedorTipoArchivoComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Administrador CCA'],
    },
  },
  {
    path: 'mantenedor-contingencia-starach',
    component: MantenedorContingenciaStarachComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Operador CCA', 'Administrador CCA'],
    },
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [CheckRolGuard],
    data: {
      expectedRol: ['Operador CCA', 'Administrador CCA'],
    },
  },

  {
    path: '*',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  /*  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  }, */

  // {
  //   path: '',
  //   component: LoginPageComponent,
  //   loadChildren: () =>
  //     import(`./modules/login/login.module`).then((m) => m.LoginModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
