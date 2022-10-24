import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { IpService } from 'src/app/core/services/util/ip.service';
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
    private _authService: AuthService,
    private _ipService: IpService
  ) {
    this.ipAddress = '127.0.0.1';
  }

  mensajeAlertaDatos!: string;
  mostrarAlerta!: boolean;
  ipAddress: string;
  @Output() inicioSesion = new EventEmitter<boolean>();

  //Validaciones formulario
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
    password: string,
    ip: string,
    nombreEquipo: string,
    sessionAcceso: string
  ) {
    this._authService
      .auth(usuario, password)
      .subscribe((rest) => {
        if (rest.detalle === 'Login exitoso') {
          let tarjetaUsuario = {
            idusuario: rest.usuario.idusuario,
            login: rest.usuario.login,
            rutFormateado: rest.usuario.rutFormateado,
            nombreFull: rest.usuario.nombreFull,
            perfil: rest.usuario.perfil,
            listaPerfiles: rest.usuario.listaPerfiles,
            sfechaHoraIngreso: rest.usuario.sfechaHoraIngreso,
            idInstitucionSTR: rest.usuario.idInstitucionSTR,
          };

          window.sessionStorage['tarjetaUsuario'] =
            JSON.stringify(tarjetaUsuario);
          this.inicioSesion.emit(true);
        } else {
          this.mensajeAlertaDatos =
            'El usuario y/o la contraseña son incorrectos.';
          this.mostrarAlerta = true;
        }
      });
  }

  ipService() {
    this._ipService.ip().subscribe((rest) => {
      this.ipAddress = rest.ip.toString();
    });
  }


  ngOnInit() {
  
  }

  //Envio
  onSubmit() {
    this.mostrarAlerta = false;
    const usuario = this.formulario.value.controlUsuario;
    const password = this.formulario.value.controlPassword;
    if (usuario && password) {
      this.loginService(
        usuario,
        password,
        environment_custom.ipusuario,
        environment_custom.nombreequipo,
        environment_custom.sesionacceso
      );
    } else {
      this.formulario.markAllAsTouched();
    }
  }
}
