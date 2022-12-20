import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BusinessService } from '../../../core/services/business.service';
import { ProductorService } from '../../../core/services/productor.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isVisible = true;

  userData: any | null;

  menuProductor = [
    { title: "Inicio", path: "#/productor/home", icon: "fa-home" },
    { title: "Mi Perfil", path: "#/productor/profile", icon: "fa-user" },
    { title: "Registro de declaración", path: "#/productor/form", icon: "fa-file-text" },
    { title: "Consulta de declaración", path: "#/productor/statements", icon: "fa-search" },

  ];

  menuAdmin = [
    { title: "Inicio", path: "#/mantenedor/home", icon: "fa-home" },
    { title: "Empresas", path: "#/mantenedor/business", icon: "fa-file-text" }

  ];

  constructor(private router: Router,
    public businessService: BusinessService,
    private productorService: ProductorService) { }

  ngOnInit(): void {
    
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
  }

  hideSidebar() {
    if(window.innerWidth <= 992){
      document.getElementById('sidebar')?.classList.toggle("active");
    }
  }

  async showDialog() {
    Swal.fire({
      title: 'Ingrese Datos',
      html: '<input id="inp_id_business" type="number" placeholder="ID Empresa" class="form-control"><br><input id="inp_year" type="number" placeholder="AÑO Declaración" class="form-control">',
      showCancelButton: true,
      preConfirm: async () => {
        const id_business = parseInt((document.getElementById('inp_id_business') as HTMLInputElement).value);
        const year = parseInt((document.getElementById('inp_year') as HTMLInputElement).value);
        const actual = new Date().getFullYear();
        if ((year >= 1000 && year <= 9999) && year <= actual && id_business > 0) {
          await this.businessService.verifyBusiness(id_business).subscribe(r => {
            if (r.status) {
              this.productorService.verifyDraft(id_business, year).subscribe(r => {
                if (!r.status) {
                  this.router.navigate(['/productor/form'], { queryParams: { year, id_business } });
                } else {
                  Swal.fire({
                    icon: 'info',
                    title: '¡Oops!',
                    text: 'Ya existe declaración enviada'
                  });
                }
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: '¡Oops!',
                text: 'Usuario no pertenece a empresa'
              });
            }
          });
        } else {
          Swal.showValidationMessage('ID y/o Año incorrecto. Favor verificar')
        }
      }
    }).then(result => {
    });
  }

}
