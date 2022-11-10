import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RecoveryComponent } from './pages/recovery/recovery.component';
import { SendCodeComponent } from './pages/send-code/send-code.component';
import { VerifyCodeComponent } from './pages/verify-code/verify-code.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'sendCode', component: SendCodeComponent},
      { path: 'recovery', component: RecoveryComponent},
      { path: 'verifycode', component: VerifyCodeComponent},
      { path: '**', redirectTo: 'login', pathMatch: 'full' }
    ]
  }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }