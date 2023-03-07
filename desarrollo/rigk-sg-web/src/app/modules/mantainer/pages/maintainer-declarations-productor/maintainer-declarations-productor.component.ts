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
  }, {
    'ID empresa': 1, 'Nombre empresa': 1, 'Año declaración': 1
  }];

  R_PapelCarton_NP: any;
  R_PapelCarton_P: any;
  R_PapelCarton_ST: any;
  R_Metal_NP: any;
  R_Metal_P: any;
  R_Metal_ST: any;
  R_Plastico_NP: any;
  R_Plastico_P: any;
  R_Plastico_ST: any;
  R_Madera_NP: any;
  R_Madera_P: any;
  R_Madera_ST: any;
  R_Total_Ton: any;
  R_Total_UF: any;
  NR_PapelCarton_NP: any;
  NR_PapelCarton_P: any;
  NR_PapelCarton_ST: any;
  NR_Metal_P: any;
  NR_Metal_NP: any;
  NR_Metal_ST: any;
  NR_Plastico_NP: any;
  NR_Plastico_P: any;
  NR_Plastico_ST: any;
  NR_Madera_NP: any;
  NR_Madera_P: any;
  NR_Madera_ST: any;
  NR_Compuestos_NP: any;
  NR_Compuestos_P: any;
  NR_Compuestos_ST: any;
  NR_Total_Ton: any;
  NR_Total_UF: any;
  RET_PapelCarton_NP: any;
  RET_PapelCarton_P: any;
  RET_PapelCarton_ST: any;
  RET_Metal_NP: any;
  RET_Metal_P: any;
  RET_Metal_ST: any;
  RET_Plastico_NP: any;
  RET_Plastico_P: any;
  RET_Plastico_ST: any;
  RET_Madera_NP: any;
  RET_Madera_P: any;
  RET_Madera_ST: any;
  RET_Total_Ton: any;
  RET_Total_UF: any;
  Ajuste_PapelCarton_Reciclable_Ton: any;
  Ajuste_Metal_Reciclable_Ton: any;
  Ajuste_Plastico_Reciclable_Ton: any;
  Ajuste_No_Reciclables_Ton: any;
  Ajuste_Retornables_Ton: any;
  Ajuste_PapelCarton_Reciclable_UF: any;
  Ajuste_Metal_Reciclable_UF: any;
  Ajuste_Plastico_Reciclable_UF: any;
  Ajuste_No_Reciclables_UF: any;
  TotalCorregido: any;
  TotalBruto: any;

  userData: any | null;

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllBusiness();
  }

  years: number[] = [];
  selectedYear: number;
  listBusiness: any[] = [];
  listStatements: any[] = [];
  filteredListBusiness: any[] = [];
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
        console.log(this.listBusiness)
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

  loadStatements(year: any) {
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
        this.filteredListBusiness = this.listBusiness.filter(business => {
          return !this.listStatements.some(statement => statement.ID_BUSINESS === business.ID);
        });
        console.log(this.filteredListBusiness)
      }
    })
  }

  generarExcel = async (nombreArchivo: string) => {
    const y = parseInt((document.getElementById('f_year') as HTMLSelectElement).value);
    console.log('year ', y)
    // Esperar a que se complete la petición y obtener los datos
    const r = await this.productorService.getAllStatementByYear(y).toPromise();
    if (r.status) {
      this.listStatements = r.data.res_business.sort((a: { STATE: number; ID_BUSINESS: number; }, b: { STATE: number; ID_BUSINESS: number; }) => {
        if (a.STATE === b.STATE) {
          return a.ID_BUSINESS - b.ID_BUSINESS;
        } else {
          return b.STATE - a.STATE;
        }
      });
      this.filteredListBusiness = this.listBusiness.filter(business => {
        return !this.listStatements.some(statement => statement.ID_BUSINESS === business.ID);
      });
    }

    console.log(this.listStatements)
    console.log(this.filteredListBusiness)

    const f = await this.productorService.getDetailByIdHeader(240).toPromise();
    if (f.status) {
      console.log(f)
    }

    for (let i = 0; i < this.listStatements.length; i++) {
      if (this.listStatements[i].STATE) {
        const fecha = this.listStatements[i].UPDATED_AT;
        const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

        this.datos.push({
          'ID empresa': this.listStatements[i].CODE_BUSINESS, 'Nombre empresa': this.listStatements[i].NAME, 'Año declaración': y, 'Estado declaración': 'Enviada',
          'Fecha de envío': fechaFormateada, 'Usuario': this.listStatements[i].AM_FIRST_NAME + ' ' + this.listStatements[i].AM_LAST_NAME
        });
      }
      else {
        this.datos.push({
          'ID empresa': this.listStatements[i].CODE_BUSINESS, 'Nombre empresa': this.listStatements[i].NAME, 'Año declaración': y, 'Estado declaración': 'Borrador',
          'Fecha de envío': 'NA', 'Usuario': this.listStatements[i].AM_FIRST_NAME + ' ' + this.listStatements[i].AM_LAST_NAME
        });
      }

    }
    for (let i = 0; i < this.filteredListBusiness.length; i++) {
      this.datos.push({
        'ID empresa': this.filteredListBusiness[i].CODE_BUSINESS, 'Nombre empresa': this.filteredListBusiness[i].NAME, 'Año declaración': '', 'Estado declaración': 'NA',
        'Fecha de envío': 'NA', 'Usuario': 'NA'
      });
    }

    // Crear un nuevo libro de Excel
    const libro = XLSX.utils.book_new();

    // Crear una nueva hoja de Excel
    const hoja = XLSX.utils.json_to_sheet(this.datos);

    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(libro, hoja, 'Datos');

    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);

    this.datos = []
  }
}
