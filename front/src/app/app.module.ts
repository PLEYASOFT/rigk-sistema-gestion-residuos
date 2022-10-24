import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { LoginModule } from './modules/login/login.module';
import { MonitorTefModule } from './modules/monitor-tef/monitor-tef.module';
import { HomeModule } from './modules/home/home.module';
import { MonitorTransferenciaModule } from './modules/monitor-transferencia/monitor-transferencia.module';
import { MonitorCopiaModule } from './modules/monitor-copia/monitor-copia.module';
import { MonitorIntegradoModule } from './modules/monitor-integrado/monitor-integrado.module';
import { MonitorCasillaCcaModule } from './modules/monitor-casilla-cca/monitor-casilla-cca.module';
import { ConsultaTransferenciaModule } from './modules/consulta-transferencia/consulta-transferencia.module';
import { ConsultaCcaCopiaModule } from './modules/consulta-cca-copia/consulta-cca-copia.module';
import { ConsultaTefModule } from './modules/consulta-tef/consulta-tef.module';
import { ConsultaContingenciaStarAchModule } from './modules/consulta-contingencia-StarAch/consulta-contingencia-StarAch.module';
import { ConsultaContingenciaCasillaSTIModule } from './modules/consulta-contingencia-casilla-STI/consulta-contingencia-casilla-STI.module';
import { ConsultaCasillaCcaModule } from './modules/consulta-casilla-cca/consulta-casilla-cca.module';
import { MantenedorBancosModule } from './modules/mantenedor-bancos/mantenedor-bancos.module';
import { MantenedorTipoDeArchivoModule } from './modules/mantenedor-tipo-de-archivo/mantenedor-tipo-de-archivo.module';
import { MantenedorContingenciasStarachModule } from './modules/mantenedor-contingencias-starach/mantenedor-contingencias-starach.module';
import { RouterModule } from '@angular/router';
import { ConsultaContingenciasModule } from './modules/consulta-contingencias/consulta-contingencias.module';
import { ConsultaAlertaTransferenciaModule } from './modules/consulta-alerta-traansferencia/consulta-alerta-transferencia.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    RouterModule,
    BrowserModule,
    HttpClientModule,
    SharedModule,
    LoginModule,
    MonitorTefModule,
    HomeModule,
    MonitorTransferenciaModule,
    MonitorCopiaModule,
    MonitorIntegradoModule,
    MonitorCasillaCcaModule,
    ConsultaTransferenciaModule,
    ConsultaCcaCopiaModule,
    ConsultaTefModule,
    ConsultaContingenciaStarAchModule,
    ConsultaContingenciaCasillaSTIModule,
    ConsultaCasillaCcaModule,
    MantenedorBancosModule,
    MantenedorTipoDeArchivoModule,
    MantenedorContingenciasStarachModule,
    ConsultaContingenciasModule,
    ConsultaAlertaTransferenciaModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
