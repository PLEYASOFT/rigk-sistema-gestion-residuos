import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router'; // CLI imports router
import { StorageService } from 'src/app/core/services/util/storage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  /**
   * Modulo de monitores (referenciado como 'MO' y los submodulos como 'A-1,2,3...')
   * Modulo de Consultas (referenciado como 'CO' y los submodulos como 'b-1,2,3...')
   * Modulo de Mantenedores (referenciado como 'MA' y los submodulos como 'c-1,2,3...')
   */
  sesionData: any = false;
  roles = '';
  moduloOpen: string = 'N'; //esta variable se ocupara para abrir y cerrar modulos al navegar entre ellos
  moduloSecundarioOpen: string = 'N'; //esta variable se utiliza para dejar el modulo seleccionado abierto cuando abre otro modulo
  menuSeleccionado: string = 'N'; //se utiliza ara dejar coloreado el submodulo seleccionado

  constructor(private router: Router, private _sesionService: StorageService) {}

  ngOnInit(): void {
    this.getDataSession();
   
  }

  getDataSession(): void {
    this.sesionData = this._sesionService.getSessionDataUser();
    this.roles = this.sesionData.perfil;
    console.log(this.roles);
  }

  redirectRuta(moduloS: string, menuS: string, ruta: string) {
    this.router.navigate([ruta]);
    this.menuSeleccionado = menuS;
    this.moduloSecundarioOpen = moduloS;
    console.log(this.menuSeleccionado);
  }

  modulosOpen(modulo: string): void {
    const nameModulo = document.getElementById('consulta-transferencias');
    console.log('asdsd', modulo);
    if (this.moduloOpen == modulo) {
      this.moduloOpen = 'false';
    } else {
      this.moduloOpen = modulo;
    }
    console.log('this', this.moduloOpen);
  }

  prueba(target: any) {
    console.log('target', target);
  }
}
