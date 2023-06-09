import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { ProductorStatementRoutingModule } from './productor-statement-routing.module';
import { FormComponent } from './pages/form/form.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StatementsComponent } from './pages/statements/statements.component';
import { SummaryStatementComponent } from './components/summary-statement/summary-statement.component';
import { FormStatementComponent } from './components/form-statement/form-statement.component';
import { SendStatementComponent } from './components/send-statement/send-statement.component';
import { RatesComponent } from './pages/rates/rates.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
@NgModule({
  declarations: [
    FormComponent,
    HomeComponent,
    LayoutComponent,
    ProfileComponent,
    StatementsComponent,
    SummaryStatementComponent,
    FormStatementComponent,
    SendStatementComponent,
    RatesComponent
  ],
  imports: [
    CommonModule,
    ProductorStatementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    DropdownModule
  ],
  providers: [CurrencyPipe]
})
export class ProductorStatementModule { }
