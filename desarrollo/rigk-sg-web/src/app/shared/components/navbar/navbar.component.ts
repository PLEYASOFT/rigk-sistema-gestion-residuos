import { Component, OnInit } from '@angular/core';
import { LoadJSService } from 'src/app/core/services/load-script/load-js.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  sessionData: any;
  iniciales!:string;
  constructor(
    private session: StorageService,
    private loadScripts: LoadJSService,
  ) {}

  ngOnInit(): void {
    this.loadScripts.load(['estructura/animacion']);
    this.sessionData = this.session.getSessionDataUser();
  }

  limpiarSesion() {
    sessionStorage.clear();
    location.reload();
  }
}
