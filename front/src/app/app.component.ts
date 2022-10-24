import { Component, OnInit } from '@angular/core';
import { CargarJsService } from './core/services/cargarScript/cargar-js.service';
import { StorageService } from './core/services/util/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  inicioSesion: boolean = true;
  constructor(
    private cargaScripts: CargarJsService,
    private _dataSessionService: StorageService
  ) {
    this.inicioSesion = false;
    cargaScripts.carga([
      'jquery-1.12.0.min',
      'jquery.mCustomScrollbar.concat.min',
      'cdn',
      'function/timeOut',
    ]);
  }
  ngOnInit(): void {
    this._dataSessionService.getSessionDataUser() != ''
      ? (this.inicioSesion = true)
      : (this.inicioSesion = false);
  }
  estadoInicioSesion(estadoSesion: boolean) {
    this.inicioSesion = estadoSesion;
  }

  title = 'front';
}
