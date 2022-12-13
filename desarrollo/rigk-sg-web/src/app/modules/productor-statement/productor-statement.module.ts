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

@NgModule({
  declarations: [
    FormComponent,
    HomeComponent,
    LayoutComponent,
    ProfileComponent,
    StatementsComponent,
    SummaryStatementComponent,
    FormStatementComponent
  ],
  imports: [
    CommonModule,
    ProductorStatementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CurrencyPipe]
})
export class ProductorStatementModule { }
