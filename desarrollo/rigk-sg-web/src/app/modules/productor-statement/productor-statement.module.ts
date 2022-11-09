import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductorStatementRoutingModule } from './productor-statement-routing.module';
import { FormComponent } from './pages/form/form.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './pages/layout/layout.component';


@NgModule({
  declarations: [
    FormComponent,
    HomeComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    ProductorStatementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductorStatementModule { }
