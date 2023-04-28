import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerStatementRoutingModule } from './manager-statement-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StatementsComponent } from './pages/statements/statements.component';


@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    StatementsComponent
  ],
  imports: [
    CommonModule,
    ManagerStatementRoutingModule
  ]
})
export class ManagerStatementModule { }
