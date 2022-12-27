import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MantainerRoutingModule } from './mantainer-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { MaintainerBusinessComponent } from './pages/maintainer-business/maintainer-business.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    MaintainerBusinessComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    MantainerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MantainerModule { }
