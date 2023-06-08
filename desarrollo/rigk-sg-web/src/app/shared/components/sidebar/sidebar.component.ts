import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BusinessService } from '../../../core/services/business.service';
import { ProductorService } from '../../../core/services/productor.service';
import { ConsumerService } from '../../../core/services/consumer.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isVisible = true;

  userData: any | null;

  year = new Date().getFullYear();

  menuProductor = [
    { title: "Inicio", path: "#/productor/home", icon: "fa-home" },
    { title: "Mi Perfil", path: "#/productor/profile", icon: "fa-user" },
    { title: "Tarifas", path: "#/productor/rates", icon: "fa-dollar" },
    { title: "Preguntas frecuentes", path: "#/productor/faq", icon: "fa-search" },
    { title: "Registro de declaración", path: "#/productor/form", icon: "fa-file-text" },
    { title: "Consulta de declaración", path: "#/productor/statements", icon: "fa-search" },
  ];

  menuConsumidor = [
    { title: "Inicio", path: "#/consumidor/home", icon: "fa-home" },
    { title: "Mi Perfil", path: "#/consumidor/profile", icon: "fa-user" },
    { title: "Preguntas frecuentes", path: "#/consumidor/faq", icon: "fa-search" },
    { title: "Registro de declaración", path: "#/consumidor/form", icon: "fa-file-text" },
    { title: "Carga Masiva", path: "#/consumidor/bulk-upload", icon: "fa-upload" },
    { title: "Consulta de declaración", path: "#/consumidor/statements", icon: "fa-search" },
  ];

  menuAdmin = [
    { title: "Inicio", path: "#/mantenedor/home", icon: "fa-home" },
    { title: "Mi Perfil", path: "#/mantenedor/profile", icon: "fa-user" },
    { title: "Preguntas frecuentes", path: "#/mantenedor/faq", icon: "fa-search" },
    { title: "Mantenedor Empresas", path: "#/mantenedor/business", icon: "fa-file-text" },
    { title: "Mantenedor Establecimientos", path: "#/mantenedor/establishment", icon: "fa-file-text" },
    { title: "Mantenedor Usuarios", path: "#/mantenedor/users", icon: "fa-users" },
    { title: "Mantenedor Gestores", path: "#/mantenedor/managers", icon: "fa-male" },
    { title: "Declaraciones Productores", path: "#/mantenedor/declarations", icon: "fa fa-database" },
  ];

  menuGestor = [
    { title: "Inicio", path: "#/gestor/home", icon: "fa-home" },
    { title: "Mi Perfil", path: "#/gestor/profile", icon: "fa-user" },
    { title: "Preguntas frecuentes", path: "#/gestor/faq", icon: "fa-search" },
    { title: "Consulta de declaración", path: "#/gestor/statements", icon: "fa-file-text" },
  ];

  constructor(private router: Router,
    public businessService: BusinessService,
    public ss: ConsumerService,
    private productorService: ProductorService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
  }
  hideSidebar() {
    if (window.innerWidth <= 992) {
      document.getElementById('sidebar')?.classList.toggle("active");
    }
  }
  async showDialog() {
    Swal.fire({
      title: 'Ingrese Datos',
      html: '<input id="inp_id_business" type="text" placeholder="ID Empresa" class="form-control"><br><input id="inp_year" type="number" placeholder="AÑO Declaración" class="form-control"><p>Corresponde declarar año ' + (+this.year - 1) + '</p>',
      showCancelButton: true,
      confirmButtonText: 'Aceptar ',
      cancelButtonText: 'Cancelar',
      preConfirm: async () => {
        const id_business = ((document.getElementById('inp_id_business') as HTMLInputElement).value);
        const year = parseInt((document.getElementById('inp_year') as HTMLInputElement).value);
        const actual = new Date().getFullYear();
        if (!(year < actual && id_business != '')) {
          Swal.showValidationMessage(`Solo se aceptan antes del año ${actual}`);
          return;
        }
        if ((year >= 1000 && year <= 9999) && year < actual && id_business != '') {
          await this.businessService.verifyBusiness(id_business).subscribe({
            next: r => {
              if (r.status) {
                this.productorService.verifyDraft(id_business, year).subscribe({
                  next: e => {
                    if (!e.status) {
                      this.router.navigate(['/productor/form'], { queryParams: { year, id_business } });
                    } else {
                      console.log(e)
                      if(e.data[0].state == 2) {
                        this.router.navigate(['/productor/form'], { queryParams: { year, id_business } });
                        sessionStorage.setItem("state", "2");
                        sessionStorage.setItem("id_statement", e.data[0].id);
                      } else {
                        Swal.fire({
                          icon: 'info',
                          title: '¡Oops!',
                          text: 'Ya existe declaración enviada'
                        });
                      }
                    }
                  }
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: '¡Oops!',
                  text: 'Usuario no pertenece a empresa'
                });
              }
            }
          });
        } else {
          Swal.showValidationMessage('ID y/o Año incorrecto. Favor verificar')
        }
      }
    }).then(result => {
    });
  }
  async showDialog2() {
    Swal.fire({
      title: 'Ingrese Datos',
      html: '<input id="inp_id_business" type="text" placeholder="ID Empresa" class="form-control"><br><input id="inp_year_modal" type="number" placeholder="AÑO Declaración" class="form-control">',
      showCancelButton: true,
      confirmButtonText: 'Aceptar ',
      cancelButtonText: 'Cancelar',
      preConfirm: async () => {
        const id_business = ((document.getElementById('inp_id_business') as HTMLInputElement).value);
        const year = parseInt((document.getElementById('inp_year_modal') as HTMLInputElement).value);
        const actual = new Date().getFullYear();
        if (!(year <= actual && id_business != '')) {
          Swal.showValidationMessage(`Solo se aceptan antes del año ${actual + 1}`);
          return;
        }
        if ((year >= 1000 && year <= 9999) && year <= actual && id_business != '') {
          await this.businessService.verifyBusiness(id_business).subscribe({
            next: r => {
              if (r.status) {
                this.router.navigate(['/consumidor/form'], { queryParams: { year, id_business: r.data, code: id_business } });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: '¡Oops!',
                  text: 'Usuario no pertenece a empresa'
                });
              }
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