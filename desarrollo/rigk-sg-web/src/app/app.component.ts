import { Component, OnInit } from '@angular/core';
import { LoadJSService } from './core/services/load-script/load-js.service';
import { StorageService } from './core/services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  inicioSesion: boolean = true;
  constructor(
    private cargaScripts: LoadJSService,
    private _dataSessionService: StorageService
  ) {
    this.inicioSesion = false;
    cargaScripts.load([
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
