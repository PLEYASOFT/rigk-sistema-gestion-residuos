import { Component, OnInit } from '@angular/core';
import { CargarJsService } from 'src/app/core/services/cargarScript/cargar-js.service';
import { StorageService } from 'src/app/core/services/util/storage.service';
import { UtilsService } from 'src/app/core/services/util/utils.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  sesionData: any;
  iniciales!:string;
  constructor(
    private _sesion: StorageService,
    private cargaScripts: CargarJsService,
    private _inicialesNombre:UtilsService
  ) {}

    
  

  ngOnInit(): void {
    this.cargaScripts.carga(['estructura/animacion']);
    this.sesionData = this._sesion.getSessionDataUser();
    
 
    this.iniciales = this._inicialesNombre.inicialesNombre(this.sesionData.nombreFull)
  }

  limpiarSesion() {
    sessionStorage.clear();
    location.reload();
  }
}
