import { Component, OnInit } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-maintainer-declarations-productor',
  templateUrl: './maintainer-declarations-productor.component.html',
  styleUrls: ['./maintainer-declarations-productor.component.css']
})
export class MaintainerDeclarationsProductorComponent implements OnInit {

  datos: any[] = [{
    'ID empresa': 1, 'Nombre empresa': 1, 'Año declaración': 1, 'Estado declaración': 1, 'Fecha de envío': 1, 'Usuario': 1, 'R. Papel/cartón NP': 1, 'R. Papel/cartón P': 1, 'R. Papel/cartón ST': 1, 'R. Metal NP': 1, 'R. Metal P': 1, 'R. Metal ST': 1, 'R. Plástico NP': 1, 'R. Plástico P': 1, 'R. Plástico ST': 1, 'R. Madera NP': 1, 'R. Madera P': 1, 'R. Madera ST': 1, 'R. Total Ton': 1, 'R. Total UF': 1, 'NR. Papel/cartón NP': 1, 'NR. Papel/cartón P': 1, 'NR. Papel/cartón ST': 1, 'NR. Metal P': 1, 'NR. Metal NP': 1, 'NR. Metal ST': 1, 'NR. Plástico NP': 1, 'NR. Plástico P': 1, 'NR. Plástico ST': 1, 'NR. Madera NP': 1, 'NR. Madera P': 1, 'NR. Madera ST': 1, 'NR. Compuestos NP': 1, 'NR. Compuestos P': 1, 'NR. Compuestos ST': 1, 'NR. Total Ton': 1, 'NR. Total UF': 1, 'RET. Papel/cartón NP': 1, 'RET. Papel/cartón P': 1, 'RET. Papel/cartón ST': 1, 'RET. Metal NP': 1, 'RET. Metal P': 1, 'RET. Metal ST': 1, 'RET. Plástico NP': 1, 'RET. Plástico P': 1, 'RET. Plástico ST': 1, 'RET. Madera NP': 1, 'RET. Madera P': 1, 'RET. Madera ST': 1, 'RET. Total Ton': 1, 'RET. Total UF': 1, 'Ajuste Papel/Cartón Reciclable\t Ton': 1, 'Ajuste Metal Reciclable Ton': 1, 'Ajuste Plástico Reciclable Ton': 1, 'Ajuste No Reciclables Ton': 1, 'Ajuste Retornables Ton': 1, 'Ajuste Papel/Cartón Reciclable\t UF': 1, 'Ajuste Metal Reciclable UF': 1, 'Ajuste Plástico Reciclable UF': 1, 'Ajuste No Reciclables UF': 1, 'Total corregido (UF)': 1, 'Total Bruto (CLP) + IVA': 1
  }, {
    'ID empresa': 1, 'Nombre empresa': 1, 'Año declaración': 1, 'Estado declaración': 1, 'Fecha de envío': 1, 'Usuario': 1, 'R. Papel/cartón NP': 1, 'R. Papel/cartón P': 1, 'R. Papel/cartón ST': 1, 'R. Metal NP': 1, 'R. Metal P': 1, 'R. Metal ST': 1, 'R. Plástico NP': 1, 'R. Plástico P': 1, 'R. Plástico ST': 1, 'R. Madera NP': 1, 'R. Madera P': 1, 'R. Madera ST': 1, 'R. Total Ton': 1, 'R. Total UF': 1, 'NR. Papel/cartón NP': 1, 'NR. Papel/cartón P': 1, 'NR. Papel/cartón ST': 1, 'NR. Metal P': 1, 'NR. Metal NP': 1, 'NR. Metal ST': 1, 'NR. Plástico NP': 1, 'NR. Plástico P': 1, 'NR. Plástico ST': 1, 'NR. Madera NP': 1, 'NR. Madera P': 1, 'NR. Madera ST': 1, 'NR. Compuestos NP': 1, 'NR. Compuestos P': 1, 'NR. Compuestos ST': 1, 'NR. Total Ton': 1, 'NR. Total UF': 1, 'RET. Papel/cartón NP': 1, 'RET. Papel/cartón P': 1, 'RET. Papel/cartón ST': 1, 'RET. Metal NP': 1, 'RET. Metal P': 1, 'RET. Metal ST': 1, 'RET. Plástico NP': 1, 'RET. Plástico P': 1, 'RET. Plástico ST': 1, 'RET. Madera NP': 1, 'RET. Madera P': 1, 'RET. Madera ST': 1, 'RET. Total Ton': 1, 'RET. Total UF': 1, 'Ajuste Papel/Cartón Reciclable\t Ton': 1, 'Ajuste Metal Reciclable Ton': 1, 'Ajuste Plástico Reciclable Ton': 1, 'Ajuste No Reciclables Ton': 1, 'Ajuste Retornables Ton': 1, 'Ajuste Papel/Cartón Reciclable\t UF': 1, 'Ajuste Metal Reciclable UF': 1, 'Ajuste Plástico Reciclable UF': 1, 'Ajuste No Reciclables UF': 1, 'Total corregido (UF)': 1, 'Total Bruto (CLP) + IVA': 1
  },{
    'ID empresa': 1, 'Nombre empresa': 1, 'Año declaración': 1}];

  userData: any | null;

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllBusiness();
  }

  years: number[] = [];
  selectedYear: number;
  listBusiness: any[] = [];
  listStatements: any[] =[];

  //Automatizado para años posteriores
  constructor(private businesService: BusinessService,
    public productorService: ProductorService,) {
    const currentYear = new Date().getFullYear();
    for (let year = 2022; year <= currentYear; year++) {
      this.years.push(year);
    }
    this.selectedYear = currentYear;
  }

  getAllBusiness() {
    this.businesService.getAllBusiness().subscribe({
      next: resp => {
        this.listBusiness = resp.status;
      },
      error: r => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          text: r.msg,
          title: '¡Ups!'
        });
      }
    });
  }

  loadStatements(year:any) {
    this.productorService.getAllStatementByYear(year).subscribe(r => {
      if (r.status) {
        this.listStatements = r.data.res_business.sort((a: { STATE: number; ID_BUSINESS: number; }, b: { STATE: number; ID_BUSINESS: number; }) => {
          if (a.STATE === b.STATE) {
            return a.ID_BUSINESS - b.ID_BUSINESS;
          } else {
            return b.STATE - a.STATE;
          }
        });
        console.log(this.listStatements)
      }
    })
  }

  generarExcel( nombreArchivo: string) {
    const y = (document.getElementById('f_year') as HTMLSelectElement).value;
    this.loadStatements(y);
    //ID EMPRESA / NOMBRE / AÑ0
    for (let i = 0; i < this.listBusiness.length; i++) {
      this.datos.push({'ID empresa': this.listBusiness[i].CODE_BUSINESS,'Nombre empresa': this.listBusiness[i].NAME,'Año declaración':y});
    }

    // Crear un nuevo libro de Excel
    const libro = XLSX.utils.book_new();

    // Crear una nueva hoja de Excel
    const hoja = XLSX.utils.json_to_sheet(this.datos);

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(libro, hoja, 'Datos');

    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
  }
}
