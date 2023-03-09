import { Component, OnInit } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import { RatesTsService } from 'src/app/core/services/rates.ts.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-maintainer-declarations-productor',
  templateUrl: './maintainer-declarations-productor.component.html',
  styleUrls: ['./maintainer-declarations-productor.component.css']
})
export class MaintainerDeclarationsProductorComponent implements OnInit {

  datos: any[] = [];

  R_PapelCarton_NP: any = 0;
  R_PapelCarton_P: any = 0;
  R_PapelCarton_ST: any = 0;
  R_Metal_NP: any = 0;
  R_Metal_P: any = 0;
  R_Metal_ST: any = 0;
  R_Plastico_NP: any = 0;
  R_Plastico_P: any = 0;
  R_Plastico_ST: any = 0;
  R_Madera_NP: any = 0;
  R_Madera_P: any = 0;
  R_Madera_ST: any = 0;
  R_Total_Ton: any = 0;
  R_Total_UF: any = 0;
  NR_PapelCarton_NP: any = 0;
  NR_PapelCarton_P: any = 0;
  NR_PapelCarton_ST: any = 0;
  NR_Metal_P: any = 0;
  NR_Metal_NP: any = 0;
  NR_Metal_ST: any = 0;
  NR_Plastico_NP: any = 0;
  NR_Plastico_P: any = 0;
  NR_Plastico_ST: any = 0;
  NR_Madera_NP: any = 0;
  NR_Madera_P: any = 0;
  NR_Madera_ST: any = 0;
  NR_Compuestos_NP: any = 0;
  NR_Compuestos_P: any = 0;
  NR_Compuestos_ST: any = 0;
  NR_Total_Ton: any = 0;
  NR_Total_UF: any = 0;
  RET_PapelCarton_NP: any = 0;
  RET_PapelCarton_P: any = 0;
  RET_PapelCarton_ST: any = 0;
  RET_Metal_NP: any = 0;
  RET_Metal_P: any = 0;
  RET_Metal_ST: any = 0;
  RET_Plastico_NP: any = 0;
  RET_Plastico_P: any = 0;
  RET_Plastico_ST: any = 0;
  RET_Madera_NP: any = 0;
  RET_Madera_P: any = 0;
  RET_Madera_ST: any = 0;
  RET_Total_Ton: any = 0;
  RET_Total_UF: any = 0;
  Ajuste_PapelCarton_Reciclable_Ton: any = 0;
  Ajuste_Metal_Reciclable_Ton: any = 0;
  Ajuste_Plastico_Reciclable_Ton: any = 0;
  Ajuste_No_Reciclables_Ton: any = 0;
  Ajuste_Retornables_Ton: any = 0;
  Ajuste_PapelCarton_Reciclable_UF: any = 0;
  Ajuste_Metal_Reciclable_UF: any = 0;
  Ajuste_Plastico_Reciclable_UF: any = 0;
  Ajuste_No_Reciclables_UF: any = 0;
  TotalCorregido: any = 0;
  TotalBruto: any = 0;

  l_R_PapelCarton_NP: any = 0;
  l_R_PapelCarton_P: any = 0;
  l_R_PapelCarton_ST: any = 0;
  l_R_Metal_NP: any = 0;
  l_R_Metal_P: any = 0;
  l_R_Metal_ST: any = 0;
  l_R_Plastico_NP: any = 0;
  l_R_Plastico_P: any = 0;
  l_R_Plastico_ST: any = 0;
  l_R_Madera_NP: any = 0;
  l_R_Madera_P: any = 0;
  l_R_Madera_ST: any = 0;
  l_NR_PapelCarton_NP: any = 0;
  l_NR_PapelCarton_P: any = 0;
  l_NR_PapelCarton_ST: any = 0;
  l_NR_Metal_P: any = 0;
  l_NR_Metal_NP: any = 0;
  l_NR_Metal_ST: any = 0;
  l_NR_Plastico_NP: any = 0;
  l_NR_Plastico_P: any = 0;
  l_NR_Plastico_ST: any = 0;
  l_NR_Madera_NP: any = 0;
  l_NR_Madera_P: any = 0;
  l_NR_Madera_ST: any = 0;
  l_NR_Compuestos_NP: any = 0;
  l_NR_Compuestos_P: any = 0;
  l_NR_Compuestos_ST: any = 0;
  l_RET_PapelCarton_NP: any = 0;
  l_RET_PapelCarton_P: any = 0;
  l_RET_PapelCarton_ST: any = 0;
  l_RET_Metal_NP: any = 0;
  l_RET_Metal_P: any = 0;
  l_RET_Metal_ST: any = 0;
  l_RET_Plastico_NP: any = 0;
  l_RET_Plastico_P: any = 0;
  l_RET_Plastico_ST: any = 0;
  l_RET_Madera_NP: any = 0;
  l_RET_Madera_P: any = 0;
  l_RET_Madera_ST: any = 0;
  userData: any | null;
  detailLastForm: any;
  headLastForm: any;
  rates: any;
  ratesUF: any;

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllBusiness();
    this.ratesService.getCLP.subscribe({
      next: r => {
        this.rates = r.data;
      },
      error: error => {
        Swal.close();
        Swal.fire({
          title: '¡Ups!',
          icon: 'error',
          text: 'No se logró obtener el valor de la UF',
          showConfirmButton: true
        });
        console.log(error);
      }
    });
    this.ratesService.getUF.subscribe({
      next: r => {
        this.ratesUF = r.data;
      },
      error: error => {
        Swal.close();
        Swal.fire({
          title: '¡Ups!',
          icon: 'error',
          text: 'No se logró obtener el valor de la UF',
          showConfirmButton: true
        });
        console.log(error);
      }
    });
  }

  years: number[] = [];
  selectedYear: number;
  listBusiness: any[] = [];
  listStatements: any[] = [];
  filteredListBusiness: any[] = [];
  //Automatizado para años posteriores
  constructor(private businesService: BusinessService,
    public productorService: ProductorService,
    public ratesService: RatesTsService) {
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
        this.filteredListBusiness = this.listBusiness.filter(business => {
          return !this.listStatements.some(statement => statement.ID_BUSINESS === business.ID);
        });
      }
    })
  }

  generarExcel = async (nombreArchivo: string) => {
    Swal.fire({
      title: 'Cargando Datos',
      text: 'Se está recuperando datos',
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    const y = parseInt((document.getElementById('f_year') as HTMLSelectElement).value);
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

    for (let i = 0; i < this.listStatements.length; i++) {
      const f = await this.productorService.getDetailByIdHeader(this.listStatements[i].ID_HEADER).toPromise();
      const lt = await this.productorService.getValueStatementByYear(this.listStatements[i].CODE_BUSINESS, y - 1, 0).toPromise();
      if (lt.status) {
        for (let j = 0; j < lt.data.detail.length; j++) {
          this.setLastDeclaration(lt.data.detail[j]);
        }
      }
      for (let j = 0; j < f.data.length; j++) {
        this.setDeclaration(f.data[j]);
      }
      this.R_Total_Ton = this.R_Total_Ton.toFixed(2);
      this.R_Total_UF = this.R_Total_UF.toFixed(2);
      this.NR_Total_Ton = this.NR_Total_Ton.toFixed(2);
      this.NR_Total_UF = this.NR_Total_UF.toFixed(2);
      this.RET_Total_Ton = this.RET_Total_Ton.toFixed(2);
      this.RET_Total_UF = this.RET_Total_UF.toFixed(2);

      this.calculoAjustes();
      if (this.listStatements[i].STATE) {

        const fecha = this.listStatements[i].UPDATED_AT;
        const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

        this.datos.push({
          'ID empresa': this.listStatements[i].CODE_BUSINESS, 'Nombre empresa': this.listStatements[i].NAME, 'Año declaración': y.toString(), 'Estado declaración': 'Enviada',
          'Fecha de envío': fechaFormateada, 'Usuario': this.listStatements[i].AM_FIRST_NAME + ' ' + this.listStatements[i].AM_LAST_NAME, 'R. Papel/cartón NP': this.setFormato(this.R_PapelCarton_NP),
          'R. Papel/cartón P': this.setFormato(this.R_PapelCarton_P), 'R. Papel/cartón ST': this.setFormato(this.R_PapelCarton_ST), 'R. Metal NP': this.setFormato(this.R_Metal_NP), 'R. Metal P': this.setFormato(this.R_Metal_P), 'R. Metal ST': this.setFormato(this.R_Metal_ST),
          'R. Plástico NP': this.setFormato(this.R_Plastico_NP), 'R. Plástico P': this.setFormato(this.R_Plastico_P), 'R. Plástico ST': this.setFormato(this.R_Plastico_ST), 'R. Madera NP': this.setFormato(this.R_Madera_NP), 'R. Madera P': this.setFormato(this.R_Madera_P), 'R. Madera ST': this.setFormato(this.R_Madera_ST),
          'R. Total Ton': this.setFormato(this.R_Total_Ton), 'R. Total UF': this.setFormato(this.R_Total_UF), 'NR. Papel/cartón NP': this.setFormato(this.NR_PapelCarton_NP), 'NR. Papel/cartón P': this.setFormato(this.NR_PapelCarton_P), 'NR. Papel/cartón ST': this.setFormato(this.NR_PapelCarton_ST),
          'NR. Metal NP': this.setFormato(this.NR_Metal_NP), 'NR. Metal P': this.setFormato(this.NR_Metal_P), 'NR. Metal ST': this.setFormato(this.NR_Metal_ST), 'NR. Plástico NP': this.setFormato(this.NR_Plastico_NP), 'NR. Plástico P': this.setFormato(this.NR_Plastico_P), 'NR. Plástico ST': this.setFormato(this.NR_Plastico_ST),
          'NR. Madera NP': this.setFormato(this.NR_Madera_NP), 'NR. Madera P': this.setFormato(this.NR_Madera_P), 'NR. Madera ST': this.setFormato(this.NR_Madera_ST), 'NR. Compuestos NP': this.setFormato(this.NR_Compuestos_NP), 'NR. Compuestos P': this.setFormato(this.NR_Compuestos_P), 'NR. Compuestos ST': this.setFormato(this.NR_Compuestos_ST),
          'NR. Total Ton': this.setFormato(this.NR_Total_Ton), 'NR. Total UF': this.setFormato(this.NR_Total_UF), 'RET. Papel/cartón NP': this.setFormato(this.RET_PapelCarton_NP), 'RET. Papel/cartón P': this.setFormato(this.RET_PapelCarton_P), 'RET. Papel/cartón ST': this.setFormato(this.RET_PapelCarton_ST),
          'RET. Metal NP': this.setFormato(this.RET_Metal_NP), 'RET. Metal P': this.setFormato(this.RET_Metal_P), 'RET. Metal ST': this.setFormato(this.RET_Metal_ST), 'RET. Plástico NP': this.setFormato(this.RET_Plastico_NP), 'RET. Plástico P': this.setFormato(this.RET_Plastico_P), 'RET. Plástico ST': this.setFormato(this.RET_Plastico_ST),
          'RET. Madera NP': this.setFormato(this.RET_Madera_NP), 'RET. Madera P': this.setFormato(this.RET_Madera_P), 'RET. Madera ST': this.setFormato(this.RET_Madera_ST), 'RET. Total Ton': this.setFormato(this.RET_Total_Ton), 'RET. Total UF': this.setFormato(this.RET_Total_UF),
          'Ajuste Papel/Cartón Reciclable Ton': this.setFormato(this.Ajuste_PapelCarton_Reciclable_Ton), 'Ajuste Metal Reciclable Ton': this.setFormato(this.Ajuste_Metal_Reciclable_Ton),
          'Ajuste Plástico Reciclable Ton': this.setFormato(this.Ajuste_Plastico_Reciclable_Ton), 'Ajuste No Reciclables Ton': this.setFormato(this.Ajuste_No_Reciclables_Ton),
          'Ajuste Retornables Ton': this.setFormato(this.Ajuste_Retornables_Ton.toString()), 'Ajuste Papel/Cartón Reciclable UF': this.setFormato(this.Ajuste_PapelCarton_Reciclable_UF), 'Ajuste Metal Reciclable UF': this.setFormato(this.Ajuste_Metal_Reciclable_UF),
          'Ajuste Plástico Reciclable UF': this.setFormato(this.Ajuste_Plastico_Reciclable_UF), 'Ajuste No Reciclables UF': this.setFormato(this.Ajuste_No_Reciclables_UF), 'Total corregido (UF)': this.setFormato(this.TotalCorregido), 'Total Bruto (CLP) + IVA': this.setFormato(this.TotalBruto)
        });
      }
      else {
        this.datos.push({
          'ID empresa': this.listStatements[i].CODE_BUSINESS, 'Nombre empresa': this.listStatements[i].NAME, 'Año declaración': y.toString(), 'Estado declaración': 'Borrador',
          'Fecha de envío': 'NA', 'Usuario': this.listStatements[i].AM_FIRST_NAME + ' ' + this.listStatements[i].AM_LAST_NAME
        });
      }
      this.resetDatos();
    }
    for (let i = 0; i < this.filteredListBusiness.length; i++) {
      this.datos.push({
        'ID empresa': this.filteredListBusiness[i].CODE_BUSINESS, 'Nombre empresa': this.filteredListBusiness[i].NAME, 'Año declaración': '', 'Estado declaración': 'NA',
        'Fecha de envío': 'NA', 'Usuario': 'NA'
      });
    }

    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet(this.datos);

    let objectMaxLength: number[] = [];
    for (let i = 0; i < this.datos.length; i++) {
      let value = <any>Object.values(this.datos[i]);
      for (let j = 0; j < value.length; j++) {
        objectMaxLength[j] = 30;
      }
    }

    var wscols = [];
    for (let i = 0; i < objectMaxLength.length; i++) {
      wscols.push({ width: objectMaxLength[i] });
    }
    hoja["!cols"] = wscols;
    XLSX.utils.book_append_sheet(libro, hoja, 'Datos');
    XLSX.writeFile(libro, `${nombreArchivo}.xlsx`);
    Swal.close();
    this.datos = []
  }

  setFormato(num: number | string): string {
    const numero = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    const decimal = Math.round(numero * 100) / 100;
    const [entero, decimales] = decimal.toString().split('.');
    const enteroConPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return decimales ? `${enteroConPuntos},${decimales}` : enteroConPuntos;
  }
  setDeclaration(datos: any) {
    const { RECYCLABILITY, TYPE_RESIDUE, HAZARD, PRECEDENCE, VALUE, AMOUNT } = datos;

    if (RECYCLABILITY == 1) {
      TYPE_RESIDUE == 1
        ? HAZARD == 1
          ? PRECEDENCE == 1
            ? (this.R_PapelCarton_P = VALUE)
            : (this.R_PapelCarton_ST = VALUE)
          : (this.R_PapelCarton_NP = VALUE)
        : TYPE_RESIDUE == 2
          ? HAZARD == 1
            ? PRECEDENCE == 1
              ? (this.R_Metal_P = VALUE)
              : (this.R_Metal_ST = VALUE)
            : (this.R_Metal_NP = VALUE)
          : TYPE_RESIDUE == 3
            ? HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.R_Plastico_P = VALUE)
                : (this.R_Plastico_ST = VALUE)
              : (this.R_Plastico_NP = VALUE)
            : TYPE_RESIDUE == 4 &&
            (HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.R_Madera_P = VALUE)
                : (this.R_Madera_ST = VALUE)
              : (this.R_Madera_NP = VALUE));

      this.R_Total_Ton += VALUE;
      this.R_Total_UF += AMOUNT;
    } else if (RECYCLABILITY == 2) {
      TYPE_RESIDUE == 1
        ? HAZARD == 1
          ? PRECEDENCE == 1
            ? (this.NR_PapelCarton_P = VALUE)
            : (this.NR_PapelCarton_ST = VALUE)
          : (this.NR_PapelCarton_NP = VALUE)
        : TYPE_RESIDUE == 2
          ? HAZARD == 1
            ? PRECEDENCE == 1
              ? (this.NR_Metal_P = VALUE)
              : (this.NR_Metal_ST = VALUE)
            : (this.NR_Metal_NP = VALUE)
          : TYPE_RESIDUE == 3
            ? HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.NR_Plastico_P = VALUE)
                : (this.NR_Plastico_ST = VALUE)
              : (this.NR_Plastico_NP = VALUE)
            : TYPE_RESIDUE == 4
              ? HAZARD == 1
                ? PRECEDENCE == 1
                  ? (this.NR_Madera_P = VALUE)
                  : (this.NR_Madera_ST = VALUE)
                : (this.NR_Madera_NP = VALUE)
              : TYPE_RESIDUE == 5 &&
              (HAZARD == 1
                ? PRECEDENCE == 1
                  ? (this.NR_Compuestos_P = VALUE)
                  : (this.NR_Compuestos_ST = VALUE)
                : (this.NR_Compuestos_NP = VALUE));

      this.NR_Total_Ton += VALUE;
      this.NR_Total_UF += AMOUNT;
    } else {
      TYPE_RESIDUE == 1
        ? HAZARD == 1
          ? PRECEDENCE == 1
            ? (this.RET_PapelCarton_P = VALUE)
            : (this.RET_PapelCarton_ST = VALUE)
          : (this.RET_PapelCarton_NP = VALUE)
        : TYPE_RESIDUE == 2
          ? HAZARD == 1
            ? PRECEDENCE == 1
              ? (this.RET_Metal_P = VALUE)
              : (this.RET_Metal_ST = VALUE)
            : (this.RET_Metal_NP = VALUE)
          : TYPE_RESIDUE == 3
            ? HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.RET_Plastico_P = VALUE)
                : (this.RET_Plastico_ST = VALUE)
              : (this.RET_Plastico_NP = VALUE)
            : TYPE_RESIDUE == 4 &&
            (HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.RET_Madera_P = VALUE)
                : (this.RET_Madera_ST = VALUE)
              : (this.RET_Madera_NP = VALUE));
      this.RET_Total_Ton += VALUE;
      this.RET_Total_UF += AMOUNT;
    }
  }

  setLastDeclaration(datos: any) {
    const { RECYCLABILITY, TYPE_RESIDUE, HAZARD, PRECEDENCE, VALUE } = datos;

    if (RECYCLABILITY == 1) {
      TYPE_RESIDUE == 1
        ? HAZARD == 1
          ? PRECEDENCE == 1
            ? (this.l_R_PapelCarton_P = VALUE)
            : (this.l_R_PapelCarton_ST = VALUE)
          : (this.l_R_PapelCarton_NP = VALUE)
        : TYPE_RESIDUE == 2
          ? HAZARD == 1
            ? PRECEDENCE == 1
              ? (this.l_R_Metal_P = VALUE)
              : (this.l_R_Metal_ST = VALUE)
            : (this.l_R_Metal_NP = VALUE)
          : TYPE_RESIDUE == 3
            ? HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.l_R_Plastico_P = VALUE)
                : (this.l_R_Plastico_ST = VALUE)
              : (this.l_R_Plastico_NP = VALUE)
            : TYPE_RESIDUE == 4 &&
            (HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.l_R_Madera_P = VALUE)
                : (this.l_R_Madera_ST = VALUE)
              : (this.l_R_Madera_NP = VALUE));
    } else if (RECYCLABILITY == 2) {
      TYPE_RESIDUE == 1
        ? HAZARD == 1
          ? PRECEDENCE == 1
            ? (this.l_NR_PapelCarton_P = VALUE)
            : (this.l_NR_PapelCarton_ST = VALUE)
          : (this.l_NR_PapelCarton_NP = VALUE)
        : TYPE_RESIDUE == 2
          ? HAZARD == 1
            ? PRECEDENCE == 1
              ? (this.l_NR_Metal_P = VALUE)
              : (this.l_NR_Metal_ST = VALUE)
            : (this.l_NR_Metal_NP = VALUE)
          : TYPE_RESIDUE == 3
            ? HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.l_NR_Plastico_P = VALUE)
                : (this.l_NR_Plastico_ST = VALUE)
              : (this.l_NR_Plastico_NP = VALUE)
            : TYPE_RESIDUE == 4
              ? HAZARD == 1
                ? PRECEDENCE == 1
                  ? (this.l_NR_Madera_P = VALUE)
                  : (this.l_NR_Madera_ST = VALUE)
                : (this.l_NR_Madera_NP = VALUE)
              : TYPE_RESIDUE == 5 &&
              (HAZARD == 1
                ? PRECEDENCE == 1
                  ? (this.l_NR_Compuestos_P = VALUE)
                  : (this.l_NR_Compuestos_ST = VALUE)
                : (this.l_NR_Compuestos_NP = VALUE));
    } else {
      TYPE_RESIDUE == 1
        ? HAZARD == 1
          ? PRECEDENCE == 1
            ? (this.l_RET_PapelCarton_P = VALUE)
            : (this.l_RET_PapelCarton_ST = VALUE)
          : (this.l_RET_PapelCarton_NP = VALUE)
        : TYPE_RESIDUE == 2
          ? HAZARD == 1
            ? PRECEDENCE == 1
              ? (this.l_RET_Metal_P = VALUE)
              : (this.l_RET_Metal_ST = VALUE)
            : (this.l_RET_Metal_NP = VALUE)
          : TYPE_RESIDUE == 3
            ? HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.l_RET_Plastico_P = VALUE)
                : (this.l_RET_Plastico_ST = VALUE)
              : (this.l_RET_Plastico_NP = VALUE)
            : TYPE_RESIDUE == 4 &&
            (HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.l_RET_Madera_P = VALUE)
                : (this.l_RET_Madera_ST = VALUE)
              : (this.l_RET_Madera_NP = VALUE));
    }
  }

  resetDatos() {
    this.R_PapelCarton_NP = 0; this.R_PapelCarton_P = 0; this.R_PapelCarton_ST = 0;
    this.R_Metal_NP = 0; this.R_Metal_P = 0; this.R_Metal_ST = 0;
    this.R_Plastico_NP = 0; this.R_Plastico_P = 0; this.R_Plastico_ST = 0;
    this.R_Madera_NP = 0; this.R_Madera_P = 0; this.R_Madera_ST = 0;
    this.R_Total_Ton = 0; this.R_Total_UF = 0;
    this.NR_PapelCarton_NP = 0; this.NR_PapelCarton_P = 0; this.NR_PapelCarton_ST = 0;
    this.NR_Metal_P = 0; this.NR_Metal_NP = 0; this.NR_Metal_ST = 0;
    this.NR_Plastico_NP = 0; this.NR_Plastico_P = 0; this.NR_Plastico_ST = 0;
    this.NR_Madera_NP = 0; this.NR_Madera_P = 0; this.NR_Madera_ST = 0;
    this.NR_Compuestos_NP = 0; this.NR_Compuestos_P = 0; this.NR_Compuestos_ST = 0;
    this.NR_Total_Ton = 0; this.NR_Total_UF = 0;
    this.RET_PapelCarton_NP = 0; this.RET_PapelCarton_P = 0; this.RET_PapelCarton_ST = 0;
    this.RET_Metal_NP = 0; this.RET_Metal_P = 0; this.RET_Metal_ST = 0;
    this.RET_Plastico_NP = 0; this.RET_Plastico_P = 0; this.RET_Plastico_ST = 0;
    this.RET_Madera_NP = 0; this.RET_Madera_P = 0; this.RET_Madera_ST = 0;
    this.RET_Total_Ton = 0; this.RET_Total_UF = 0;

    this.l_R_PapelCarton_NP = 0; this.l_R_PapelCarton_P = 0; this.l_R_PapelCarton_ST = 0;
    this.l_R_Metal_NP = 0; this.l_R_Metal_P = 0; this.l_R_Metal_ST = 0;
    this.l_R_Plastico_NP = 0; this.l_R_Plastico_P = 0; this.l_R_Plastico_ST = 0;
    this.l_R_Madera_NP = 0; this.l_R_Madera_P = 0; this.l_R_Madera_ST = 0;
    this.l_NR_PapelCarton_NP = 0; this.l_NR_PapelCarton_P = 0; this.l_NR_PapelCarton_ST = 0;
    this.l_NR_Metal_P = 0; this.l_NR_Metal_NP = 0; this.l_NR_Metal_ST = 0;
    this.l_NR_Plastico_NP = 0; this.l_NR_Plastico_P = 0; this.l_NR_Plastico_ST = 0;
    this.l_NR_Madera_NP = 0; this.l_NR_Madera_P = 0; this.l_NR_Madera_ST = 0;
    this.l_NR_Compuestos_NP = 0; this.l_NR_Compuestos_P = 0; this.l_NR_Compuestos_ST = 0;
    this.l_RET_PapelCarton_NP = 0; this.l_RET_PapelCarton_P = 0; this.l_RET_PapelCarton_ST = 0;
    this.l_RET_Metal_NP = 0; this.l_RET_Metal_P = 0; this.l_RET_Metal_ST = 0;
    this.l_RET_Plastico_NP = 0; this.l_RET_Plastico_P = 0; this.l_RET_Plastico_ST = 0;
    this.l_RET_Madera_NP = 0; this.l_RET_Madera_P = 0; this.l_RET_Madera_ST = 0;

    this.Ajuste_PapelCarton_Reciclable_Ton = 0;
    this.Ajuste_Metal_Reciclable_Ton = 0;
    this.Ajuste_Plastico_Reciclable_Ton = 0;
    this.Ajuste_No_Reciclables_Ton = 0;
    this.Ajuste_Retornables_Ton = 0;
    this.Ajuste_PapelCarton_Reciclable_UF = 0;
    this.Ajuste_Metal_Reciclable_UF = 0;
    this.Ajuste_Plastico_Reciclable_UF = 0;
    this.Ajuste_No_Reciclables_UF = 0;
    this.TotalCorregido = 0;
    this.TotalBruto = 0;
  }

  async calculoAjustes() {
    // Ajuste para los totales
    if ((this.l_R_PapelCarton_P + this.l_R_PapelCarton_ST + this.l_R_PapelCarton_NP) != 0) {

      this.Ajuste_PapelCarton_Reciclable_Ton = this.R_PapelCarton_P + this.R_PapelCarton_ST + this.R_PapelCarton_NP - (this.l_R_PapelCarton_P + this.l_R_PapelCarton_ST + this.l_R_PapelCarton_NP)
    }
    if ((this.l_R_Metal_P + this.l_R_Metal_ST + this.l_R_Metal_NP) != 0) {
      this.Ajuste_Metal_Reciclable_Ton = this.R_Metal_P + this.R_Metal_ST + this.R_Metal_NP - (this.l_R_Metal_P + this.l_R_Metal_ST + this.l_R_Metal_NP)
    }
    if ((this.l_R_Plastico_P + this.l_R_Plastico_ST + this.l_R_Plastico_NP) != 0) {
      this.Ajuste_Plastico_Reciclable_Ton = this.R_Plastico_P + this.R_Plastico_ST + this.R_Plastico_NP - (this.l_R_Plastico_P + this.l_R_Plastico_ST + this.l_R_PapelCarton_NP)
    }
    if ((this.l_NR_PapelCarton_P + this.l_NR_PapelCarton_ST + this.l_NR_PapelCarton_NP + this.l_NR_Metal_P + this.l_NR_Metal_ST + this.l_NR_Metal_NP + this.l_NR_Plastico_P + this.l_NR_Plastico_ST + this.l_NR_Plastico_NP + this.l_NR_Compuestos_P + this.l_NR_Compuestos_ST + this.l_NR_Compuestos_NP) != 0) {
      this.Ajuste_No_Reciclables_Ton = this.NR_PapelCarton_P + this.NR_PapelCarton_ST + this.NR_PapelCarton_NP + this.NR_Metal_P + this.NR_Metal_ST + this.NR_Metal_NP + this.NR_Plastico_P + this.NR_Plastico_ST + this.NR_Plastico_NP + this.NR_Compuestos_P + this.NR_Compuestos_ST + this.NR_Compuestos_NP - (this.l_NR_PapelCarton_P + this.l_NR_PapelCarton_ST + this.l_NR_PapelCarton_NP + this.l_NR_Metal_P + this.l_NR_Metal_ST + this.l_NR_Metal_NP + this.l_NR_Plastico_P + this.l_NR_Plastico_ST + this.l_NR_Plastico_NP + this.l_NR_Compuestos_P + this.l_NR_Compuestos_ST + this.l_NR_Compuestos_NP);
    }
    if ((this.l_RET_PapelCarton_P + this.l_RET_PapelCarton_ST + this.l_RET_PapelCarton_NP + this.l_RET_Metal_P + this.l_RET_Metal_ST + this.l_RET_Metal_NP + this.l_RET_Plastico_P + this.l_RET_Plastico_ST + this.l_RET_Plastico_NP + this.l_RET_Madera_P + this.l_RET_Madera_ST + this.l_RET_Madera_NP) != 0) {
      this.Ajuste_Retornables_Ton = this.RET_PapelCarton_P + this.RET_PapelCarton_ST + this.RET_PapelCarton_NP + this.RET_Metal_P + this.RET_Metal_ST + this.RET_Metal_NP + this.RET_Plastico_P + this.RET_Plastico_ST + this.RET_Plastico_NP + this.RET_Madera_P + this.RET_Madera_ST + this.RET_Madera_NP - (this.l_RET_PapelCarton_P + this.l_RET_PapelCarton_ST + this.l_RET_PapelCarton_NP + this.l_RET_Metal_P + this.l_RET_Metal_ST + this.l_RET_Metal_NP + this.l_RET_Plastico_P + this.l_RET_Plastico_ST + this.l_RET_Plastico_NP + this.l_RET_Madera_P + this.l_RET_Madera_ST + this.l_RET_Madera_NP);
    }
    this.Ajuste_PapelCarton_Reciclable_UF = (this.Ajuste_PapelCarton_Reciclable_Ton * this.rates[0].price).toFixed(2);
    this.Ajuste_Metal_Reciclable_UF = (this.Ajuste_Metal_Reciclable_Ton * this.rates[1].price).toFixed(2);
    this.Ajuste_Plastico_Reciclable_UF = (this.Ajuste_Plastico_Reciclable_Ton * this.rates[2].price).toFixed(2);
    this.Ajuste_No_Reciclables_UF = (this.Ajuste_No_Reciclables_Ton * this.rates[3].price).toFixed(2);

    const c1 = this.rates[0].price * parseFloat((this.R_PapelCarton_P + this.R_PapelCarton_ST + this.R_PapelCarton_NP));
    const c2 = this.rates[1].price * parseFloat((this.R_Metal_P + this.R_Metal_ST + this.R_Metal_NP));
    const c3 = this.rates[2].price * parseFloat((this.R_Plastico_P + this.R_Plastico_ST + this.R_Plastico_NP));
    const c4 = this.rates[3].price * parseFloat((this.NR_PapelCarton_P + this.NR_PapelCarton_ST + this.NR_PapelCarton_NP + this.NR_Metal_P + this.NR_Metal_ST + this.NR_Metal_NP + this.NR_Plastico_P + this.NR_Plastico_ST + this.NR_Plastico_NP + this.NR_Compuestos_P + this.NR_Compuestos_ST + this.NR_Compuestos_NP));

    this.TotalCorregido = ((c1 + parseFloat(this.Ajuste_PapelCarton_Reciclable_UF)) + (c2 + parseFloat(this.Ajuste_Metal_Reciclable_UF)) + (c3 + parseFloat(this.Ajuste_Plastico_Reciclable_UF)) + (c4 + parseFloat(this.Ajuste_No_Reciclables_UF))).toFixed(2);
    this.TotalBruto = (parseFloat(this.TotalCorregido) * this.ratesUF * 1.19).toFixed(0);
  }
}
