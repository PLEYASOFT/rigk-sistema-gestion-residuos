import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantainerRoutingModule } from './mantainer-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { MaintainerBusinessComponent } from './pages/maintainer-business/maintainer-business.component';


@NgModule({
  declarations: [
    HomeComponent,
    MaintainerBusinessComponent
  ],
  imports: [
    CommonModule,
    MantainerRoutingModule
  ]
})
export class MantainerModule { }
