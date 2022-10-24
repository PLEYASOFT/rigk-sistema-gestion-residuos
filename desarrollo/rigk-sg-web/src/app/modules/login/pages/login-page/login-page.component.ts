import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  @Output() valueInicioSesion = new EventEmitter<boolean>();

  constructor() { 
  }

  ngOnInit() {
  }

  inicioSesion(estado:boolean) {
    this.valueInicioSesion.emit(estado)
  }

}
