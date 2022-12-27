import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maintainer-business',
  templateUrl: './maintainer-business.component.html',
  styleUrls: ['./maintainer-business.component.css']
})
export class MaintainerBusinessComponent implements OnInit {

  tablas = ['Reciclable', 'No Reciclable', 'Retornables / Reutilizados'];
  residuos = [
    'Papel Cartón',
    'Metal',
    'Plástico',
    'Madera**',
    'Otro/Env. Compuesto'
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
