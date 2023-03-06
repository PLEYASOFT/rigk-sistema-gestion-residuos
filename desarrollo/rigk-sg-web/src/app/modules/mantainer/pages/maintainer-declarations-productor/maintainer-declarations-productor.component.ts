import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maintainer-declarations-productor',
  templateUrl: './maintainer-declarations-productor.component.html',
  styleUrls: ['./maintainer-declarations-productor.component.css']
})
export class MaintainerDeclarationsProductorComponent implements OnInit {


  ngOnInit(): void {
  }

  years: number[] = [];
  selectedYear: number;

  //Automatizado para años posteriores
  constructor() {
    const currentYear = new Date().getFullYear();
    for (let year = 2022; year <= currentYear; year++) {
      this.years.push(year);
    }
    this.selectedYear = currentYear;
  }

  generarExcel() {
    // Aquí iría la lógica para generar el archivo Excel
  }

}
