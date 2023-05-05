import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerStatementRoutingModule } from './manager-statement-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StatementsComponent } from './pages/statements/statements.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    StatementsComponent
  ],
  imports: [
    CommonModule,
    ManagerStatementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class ManagerStatementModule { }
