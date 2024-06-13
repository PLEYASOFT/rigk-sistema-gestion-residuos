import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerStatementRoutingModule } from './manager-statement-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StatementsComponent } from './pages/statements/statements.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BulkUploadComponent } from './pages/bulk-upload/bulk-upload.component';
import { AutoCompleteModule } from 'primeng/autocomplete';


@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    StatementsComponent,
    BulkUploadComponent
  ],
  imports: [
    CommonModule,
    ManagerStatementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    AutoCompleteModule
  ]
})
export class ManagerStatementModule { }
