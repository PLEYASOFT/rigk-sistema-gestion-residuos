import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsumerStatementRoutingModule } from './consumidor-statement-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StatementsComponent } from './pages/statements/statements.component';
import { FormComponent } from './pages/form/form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { BulkUploadComponent } from './pages/bulk-upload/bulk-upload.component';
import { StatementsDetailComponent } from './pages/statements-detail/statements-detail.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    StatementsComponent,
    FormComponent,
    BulkUploadComponent,
    StatementsDetailComponent
  ],
  imports: [
    CommonModule,
    ConsumerStatementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule
  ]
})
export class ConsumerStatementModule { }