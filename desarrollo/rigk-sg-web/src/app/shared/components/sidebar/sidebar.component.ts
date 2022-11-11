import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @Input() isVisible = true;

  menu = [
    {title: "Inicio", path: "#/productor/home", icon: "fa-home"},
    {title: "Mi Perfil", path: "#/productor/profile", icon: "fa-user"},
    {title: "Registro de declaración", path: "#/productor/form", icon: "fa-file-text"},
    {title: "Consulta de declaración", path: "#/productor/statements", icon: "fa-search"},
    
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  async showDialog() {
     Swal.fire({
      title: 'Ingrese Datos',
      html: '<input id="inp_id_business" type="number" placeholder="ID Empresa" class="form-control"><br><input id="inp_year" type="number" placeholder="AÑO Declaración" class="form-control">',
      preConfirm: () => {
        const id_business = parseInt((document.getElementById('inp_id_business') as HTMLInputElement).value);
        const year = parseInt((document.getElementById('inp_year') as HTMLInputElement).value);
        if((year >= 1000 && year<=9999 ) && id_business>0) {
          this.router.navigate(['/productor/form'],{queryParams:{year, id_business}});
        }
        
      }
    });
  }

}
