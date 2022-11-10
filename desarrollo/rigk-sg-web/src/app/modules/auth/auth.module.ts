import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { VerifyCodeComponent } from './pages/verify-code/verify-code.component';
import { SendCodeComponent } from './pages/send-code/send-code.component';


@NgModule({
  declarations: [
    LoginComponent,
    RecoveryComponent,
    VerifyCodeComponent,
    SendCodeComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
