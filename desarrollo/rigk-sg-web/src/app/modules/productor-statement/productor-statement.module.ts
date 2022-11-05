import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductorStatementRoutingModule } from './productor-statement-routing.module';
import { FormComponent } from './pages/form/form.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    CommonModule,
    ProductorStatementRoutingModule,
    SharedModule
  ]
})
export class ProductorStatementModule { }
