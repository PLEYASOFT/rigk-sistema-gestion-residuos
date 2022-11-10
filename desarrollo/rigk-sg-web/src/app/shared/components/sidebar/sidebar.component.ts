import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menu = [
    {title: "Inicio", path: "#/productor/inicio", icon: "fa-home"},
    {title: "Mi Perfil", path: "#/productor/inicio", icon: "fa-user"},
    {title: "Registro de declaración", path: "#/productor/formulario", icon: "fa-file-text"},
    {title: "Consulta de declaración", path: "#/productor/inicio", icon: "fa-search"},
    {title: "Registro de cobros y pagos", path: "#/productor/inicio", icon: "fa-usd"},
    {title: "Registro de documentación e información anexa", path: "#/productor/inicio", icon: "fa-pencil"},
    
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
