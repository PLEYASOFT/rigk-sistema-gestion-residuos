import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login/login.service';
import { environment } from 'src/environments/environment';
import { environment_custom } from 'src/environments/environment.custom';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private _loginService: LoginService
  ) {

  }

  messageDataAlerts!: string;
  showAlert!: boolean;
  @Output() inicioSesion = new EventEmitter<boolean>();

  isFormValid(component: string) {
    return (
      this.formulario.get(component)!.touched &&
      this.formulario.get(component)!.invalid
    );
  }
  hasFormError(component: string) {
    return (
      this.formulario.get(component)!.hasError('required') &&
      this.formulario.get(component)!.touched
    );
  }

  formulario = new FormGroup({
    controlUsuario: new FormControl('', Validators.required),
    controlPassword: new FormControl('', Validators.required),
  });

  getFormulario() {
    return this.formulario.controls;
  }

  loginService(
    usuario: string,
    password: string
  ) {
    this._loginService
      .login(usuario, password)
      .subscribe((rest) => {
        if (rest.id != undefined) {
          let user = {
            user: rest.id,
            password: rest.email,
            rol: "plop"
          };

          window.sessionStorage['user'] =
            JSON.stringify(user);
          this.inicioSesion.emit(true);
        } else {
          this.messageDataAlerts =
            'El usuario y/o la contraseña son incorrectos.';
          this.showAlert = true;
        }
      });
  }

  ngOnInit() {

  }

  onSubmit() {
    this.showAlert = false;
    const user = this.formulario.value.controlUsuario;
    const password = this.formulario.value.controlPassword;
    if (user && password) {
      this.loginService (
        user,
        password
      );
    } else {
      this.formulario.markAllAsTouched();
    }
  }
}
