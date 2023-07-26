import { Component, OnInit } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
import { LogsService } from 'src/app/core/services/logs.service';
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
  resumen: any[] = [];
  R_PapelCarton_NP: any = 0;
  R_PapelCarton_P: any = 0;
  R_PapelCarton_Sec: any = 0;
  R_PapelCarton_Ter: any = 0;
  R_PapelCarton_Total: any = 0;
  R_Metal_NP: any = 0;
  R_Metal_P: any = 0;
  R_Metal_Sec: any = 0;
  R_Metal_Ter: any = 0;
  R_Metal_Total: any = 0;
  R_Plastico_NP: any = 0;
  R_Plastico_P: any = 0;
  R_Plastico_Sec: any = 0;
  R_Plastico_Ter: any = 0;
  R_Plastico_Total: any = 0;
  R_Madera_NP: any = 0;
  R_Madera_P: any = 0;
  R_Madera_Sec: any = 0;
  R_Madera_Ter: any = 0;
  R_Madera_Total: any = 0;
  R_Total_Ton: any = 0;
  R_Total_UF: any = 0;
  NR_PapelCarton_NP: any = 0;
  NR_PapelCarton_P: any = 0;
  NR_PapelCarton_Sec: any = 0;
  NR_PapelCarton_Ter: any = 0;
  NR_PapelCarton_Total: any = 0;
  NR_Metal_P: any = 0;
  NR_Metal_NP: any = 0;
  NR_Metal_Sec: any = 0;
  NR_Metal_Ter: any = 0;
  NR_Metal_Total: any = 0;
  NR_Plastico_NP: any = 0;
  NR_Plastico_P: any = 0;
  NR_Plastico_Sec: any = 0;
  NR_Plastico_Ter: any = 0;
  NR_Plastico_Total: any = 0;
  NR_Madera_NP: any = 0;
  NR_Madera_P: any = 0;
  NR_Madera_Sec: any = 0;
  NR_Madera_Ter: any = 0;
  NR_Madera_Total: any = 0;
  NR_Compuestos_NP: any = 0;
  NR_Compuestos_P: any = 0;
  NR_Compuestos_Sec: any = 0;
  NR_Compuestos_Ter: any = 0;
  NR_Compuestos_Total: any = 0;
  NR_Total_Ton: any = 0;
  NR_Total_UF: any = 0;
  RET_PapelCarton_NP: any = 0;
  RET_PapelCarton_P: any = 0;
  RET_PapelCarton_Sec: any = 0;
  RET_PapelCarton_Ter: any = 0;
  RET_PapelCarton_Total: any = 0;
  RET_Metal_NP: any = 0;
  RET_Metal_P: any = 0;
  RET_Metal_Sec: any = 0;
  RET_Metal_Ter: any = 0;
  RET_Metal_Total: any = 0;
  RET_Plastico_NP: any = 0;
  RET_Plastico_P: any = 0;
  RET_Plastico_Sec: any = 0;
  RET_Plastico_Ter: any = 0;
  RET_Plastico_Total: any = 0;
  RET_Madera_NP: any = 0;
  RET_Madera_P: any = 0;
  RET_Madera_Sec: any = 0;
  RET_Madera_Ter: any = 0;
  RET_Madera_Total: any = 0;
  RET_Total_Ton: any = 0;
  RET_Total_UF: any = 0;
  EyE_PapelCarton_Rec: any = 0;
  EyE_Metal_Rec: any = 0;
  EyE_Plastico_Rec: any = 0;
  EyE_NR: any = 0;
  EyE_Ret: any = 0;
  Total_EyE: any = 0;

  PapelCarton_Rec_Uf: any = 0;
  Metal_Rec_Uf: any = 0;
  Plastico_Rec_Uf: any = 0;
  NR_Uf: any = 0;

  PapelCarton_Neto: any = 0;
  Metal_Neto: any = 0;
  Plastico_Neto: any = 0;
  NR_Neto: any = 0;

  PapelCarton_IVA: any = 0;
  Metal_IVA: any = 0;
  Plastico_IVA: any = 0;
  NR_IVA: any = 0;
  totalIVA: any = 0;

  PapelCarton_Bruto: any = 0;
  Metal_Bruto: any = 0;
  Plastico_Bruto: any = 0;
  NR_Bruto: any = 0;

  TotalBruto: any = 0;
  TotalBruto_IVA: any = 0;
  Total_Uf: any = 0;

  userData: any | null;
  detailLastForm: any;
  headLastForm: any;
  rates: any;
  ratesUF: any;

  valores = new Array(30).fill(0);

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
  selectedYear: number = -1;
  listBusiness: any[] = [];
  listStatements: any[] = [];
  filteredListBusiness: any[] = [];
  //Automatizado para años posteriores
  constructor(private businesService: BusinessService,
    public productorService: ProductorService,
    public ls: LogsService,
    public ratesService: RatesTsService) {
    const currentYear = new Date().getFullYear();
    for (let year = 2022; year <= currentYear; year++) {
      this.years.push(year);
    }
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

  allUF: any[] = [];

  generarExcel = async (nombreArchivo: string) => {
    try {
      const y = parseInt((document.getElementById('f_year') as HTMLSelectElement).value);
      // Esperar a que se complete la petición y obtener los datos
      const r = await this.productorService.getAllStatementByYear(y).toPromise();
      const rr = await this.productorService.getTMP(y).toPromise();

      const allStatements: any[] = rr.data.res_business;
      if (r.status) {
        Swal.fire({
          title: 'Cargando Datos',
          text: 'Se está recuperando datos',
          timerProgressBar: true,
          showConfirmButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false
        });
        Swal.showLoading();
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

        const getDetailsAndValues = async (statement: { ID_HEADER: number; CODE_BUSINESS: any; CREATED_BY: number; ID_BUSINESS: number }) => {
          const f = allStatements.filter(r => r.ID_HEADER == statement.ID_HEADER);
          const lt = allStatements.filter(r => r.ID_BUSINESS == statement.ID_BUSINESS && r.YEAR_STATEMENT == y - 1 && r.STATE == 1);
          const _user = allStatements.find((r: any) => r.HEADER_ID == statement.ID_HEADER);
          const user = {
            FIRST_NAME: _user.FIRST_NAME,
            LAST_NAME: _user.LAST_NAME
          };
          return { f, lt, user };
        };

        for (const statement of this.listStatements) {
          const { f, lt, user } = await getDetailsAndValues(statement);
          f.forEach((detail: any) => {
            this.setDeclaration(detail);
          });

          const fechaFormateada = new Date(statement.UPDATED_AT).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
          if (this.allUF.findIndex(r => r.date == fechaFormateada) == -1) {
            this.ratesUF = await this.ratesService.getUfDate(fechaFormateada).toPromise();
            this.allUF.push({ date: fechaFormateada, data: this.ratesUF.data });
          }
          this.calculoAjustes(fechaFormateada, statement.STATE);
          const fecha = statement.UPDATED_AT;
          const fechaFormateada__excel = new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
          this.datos.push({
            'ID empresa': statement.CODE_BUSINESS, 'Nombre empresa': statement.NAME, 'Año declaración': y.toString(), 'Estado declaración': statement.STATE == 1 ? 'Enviada' : statement.STATE == 2 ? 'Pendiente' : 'Borrador',
            'Fecha de envío': fechaFormateada__excel, 'Usuario': user.FIRST_NAME + ' ' + user.LAST_NAME, 'R. Papel/cartón NP': this.setFormato(this.R_PapelCarton_NP),
            'R. Papel/cartón P': this.setFormato(this.R_PapelCarton_P), 'R. Papel/cartón Sec': this.setFormato(this.R_PapelCarton_Sec), 'R. Papel/cartón Ter': this.setFormato(this.R_PapelCarton_Ter), 'R. Papel/cartón TOTAL': this.setFormato(this.R_PapelCarton_Total), 'R. Metal NP': this.setFormato(this.R_Metal_NP), 'R. Metal P': this.setFormato(this.R_Metal_P), 'R. Metal Sec': this.setFormato(this.R_Metal_Sec), 'R. Metal Ter': this.setFormato(this.R_Metal_Ter), 'R. Metal TOTAL': this.setFormato(this.R_Metal_Total),
            'R. Plástico NP': this.setFormato(this.R_Plastico_NP), 'R. Plástico P': this.setFormato(this.R_Plastico_P), 'R. Plástico Sec': this.setFormato(this.R_Plastico_Sec), 'R. Plástico Ter': this.setFormato(this.R_Plastico_Ter), 'R. Plástico TOTAL': this.setFormato(this.R_Plastico_Total), 'R. Madera NP': this.setFormato(this.R_Madera_NP), 'R. Madera P': this.setFormato(this.R_Madera_P), 'R. Madera Sec': this.setFormato(this.R_Madera_Sec), 'R. Madera Ter': this.setFormato(this.R_Madera_Ter), 'R. Madera TOTAL': this.setFormato(this.R_Madera_Total),
            'R. Total Ton': this.setFormato(this.R_Total_Ton), 'NR. Papel/cartón NP': this.setFormato(this.NR_PapelCarton_NP), 'NR. Papel/cartón P': this.setFormato(this.NR_PapelCarton_P), 'NR. Papel/cartón Sec': this.setFormato(this.NR_PapelCarton_Sec), 'NR. Papel/cartón Ter': this.setFormato(this.NR_PapelCarton_Ter), 'NR. Papel/cartón TOTAL': this.setFormato(this.NR_PapelCarton_Total),
            'NR. Metal NP': this.setFormato(this.NR_Metal_NP), 'NR. Metal P': this.setFormato(this.NR_Metal_P), 'NR. Metal Sec': this.setFormato(this.NR_Metal_Sec), 'NR. Metal Ter': this.setFormato(this.NR_Metal_Ter), 'NR. Metal TOTAL': this.setFormato(this.NR_Metal_Total), 'NR. Plástico NP': this.setFormato(this.NR_Plastico_NP), 'NR. Plástico P': this.setFormato(this.NR_Plastico_P), 'NR. Plástico Sec': this.setFormato(this.NR_Plastico_Sec), 'NR. Plástico Ter': this.setFormato(this.NR_Plastico_Ter), 'NR. Plástico TOTAL': this.setFormato(this.NR_Plastico_Total),
            'NR. Madera NP': this.setFormato(this.NR_Madera_NP), 'NR. Madera P': this.setFormato(this.NR_Madera_P), 'NR. Madera Sec': this.setFormato(this.NR_Madera_Sec), 'NR. Madera Ter': this.setFormato(this.NR_Madera_Ter), 'NR. Madera TOTAL': this.setFormato(this.NR_Madera_Total), 'NR. Compuestos NP': this.setFormato(this.NR_Compuestos_NP), 'NR. Compuestos P': this.setFormato(this.NR_Compuestos_P), 'NR. Compuestos Sec': this.setFormato(this.NR_Compuestos_Sec), 'NR. Compuestos Ter': this.setFormato(this.NR_Compuestos_Ter), 'NR. Compuestos TOTAL': this.setFormato(this.NR_Compuestos_Total),
            'NR. Total Ton': this.setFormato(this.NR_Total_Ton), 'RET. Papel/cartón NP': this.setFormato(this.RET_PapelCarton_NP), 'RET. Papel/cartón P': this.setFormato(this.RET_PapelCarton_P), 'RET. Papel/cartón Sec': this.setFormato(this.RET_PapelCarton_Sec), 'RET. Papel/cartón Ter': this.setFormato(this.RET_PapelCarton_Ter), 'RET. Papel/cartón TOTAL': this.setFormato(this.RET_PapelCarton_Total),
            'RET. Metal NP': this.setFormato(this.RET_Metal_NP), 'RET. Metal P': this.setFormato(this.RET_Metal_P), 'RET. Metal Sec': this.setFormato(this.RET_Metal_Sec), 'RET. Metal Ter': this.setFormato(this.RET_Metal_Ter), 'RET. Metal TOTAL': this.setFormato(this.RET_Metal_Total), 'RET. Plástico NP': this.setFormato(this.RET_Plastico_NP), 'RET. Plástico P': this.setFormato(this.RET_Plastico_P), 'RET. Plástico Sec': this.setFormato(this.RET_Plastico_Sec), 'RET. Plástico Ter': this.setFormato(this.RET_Plastico_Ter), 'RET. Plástico TOTAL': this.setFormato(this.RET_Plastico_Total),
            'RET. Madera NP': this.setFormato(this.RET_Madera_NP), 'RET. Madera P': this.setFormato(this.RET_Madera_P), 'RET. Madera Sec': this.setFormato(this.RET_Madera_Sec), 'RET. Madera Ter': this.setFormato(this.RET_Madera_Ter), 'RET. Madera TOTAL': this.setFormato(this.RET_Madera_Total), 'RET. Total Ton': this.setFormato(this.RET_Total_Ton),
            'EyE Papel/cartón Rec TOTAL': this.setFormato(this.EyE_PapelCarton_Rec), 'EyE Metal Rec TOTAL': this.setFormato(this.EyE_Metal_Rec), 'EyE Plastico Rec TOTAL': this.setFormato(this.EyE_Plastico_Rec), 'EyE NR TOTAL': this.setFormato(this.EyE_NR), 'EyE Ret TOTAL': this.setFormato(this.EyE_Ret), 'TOTAL PESO': this.setFormato(this.Total_EyE),
            'Papel/cartón Rec Tarifa': this.setFormato(this.rates[0].price), 'Metal Rec Tarifa': this.setFormato(this.rates[1].price), 'Plastico Rec Tarifa': this.setFormato(this.rates[2].price), 'NR Tarifa': this.setFormato(this.rates[3].price),
            'Papel/cartón Rec Costo Anual UF': this.setFormato(this.PapelCarton_Rec_Uf), 'Metal Rec Costo Anual UF': this.setFormato(this.Metal_Rec_Uf), 'Plastico Rec Costo Anual UF': this.setFormato(this.Plastico_Rec_Uf), 'NR Costo Anual UF': this.setFormato(this.NR_Uf), 'Total Costo Anual (UF)': this.setFormato(this.Total_Uf),
            'Papel/cartón Neto CLP': this.setFormato(this.PapelCarton_Neto), 'Metal Rec UF Neto CLP': this.setFormato(this.Metal_Neto), 'Plastico Rec UF Neto CLP': this.setFormato(this.Plastico_Neto), 'NR UF Neto CLP': this.setFormato(this.NR_Neto), 'Total Neto (CLP)': this.setFormato(this.TotalBruto),
            'Papel/cartón Rec IVA': this.setFormato(this.PapelCarton_IVA), 'Metal Rec IVA': this.setFormato(this.Metal_IVA), 'Plastico Rec IVA': this.setFormato(this.Plastico_IVA), 'NR IVA': this.setFormato(this.NR_IVA), 'Total IVA': this.setFormato(this.totalIVA),
            'Papel/cartón Bruto CLP': this.setFormato(this.PapelCarton_Bruto), 'Metal Rec UF Bruto CLP': this.setFormato(this.Metal_Bruto), 'Plastico Rec UF Bruto CLP': this.setFormato(this.Plastico_Bruto), 'NR UF Bruto CLP': this.setFormato(this.NR_Bruto), 'Total Neto (CLP) + IVA': this.setFormato(this.TotalBruto_IVA)
          });
          this.resetDatos();
        }

        for (let i = 0; i < this.filteredListBusiness.length; i++) {
          this.datos.push({
            'ID empresa': this.filteredListBusiness[i].CODE_BUSINESS, 'Nombre empresa': this.filteredListBusiness[i].NAME, 'Año declaración': '', 'Estado declaración': 'NA',
            'Fecha de envío': 'NA', 'Usuario': 'NA'
          });
        }

        let claves = [
          'Total EyE Productores (Reciclables, No Reciclables, Retornables / Reutilizables)','Total EyE Puestos en el mercado (Reciclables, No Reciclables)','Papel / cartón TOTAL  (Reciclables, No Reciclables, Retornables / Reutilizables)','Metal TOTAL  (Reciclables, No Reciclables, Retornables / Reutilizables)','Plástico TOTAL  (Reciclables, No Reciclables, Retornables / Reutilizables)','Madera TOTAL  (Reciclables, No Reciclables, Retornables / Reutilizables)','Papel /  cartón TOTAL  (Reciclables, No Reciclables)',
          'Metal  TOTAL (Reciclables, No Reciclables)','Plástico  TOTAL (Reciclables, No Reciclables)','Madera  TOTAL (Reciclables, No Reciclables)','Compuestos TOTAL (No Reciclables)','Papel /   cartón TOTAL (Reciclables)','Metal   TOTAL (Reciclables)','Plástico   TOTAL (Reciclables)','Total No Reciclable (No Reciclables)',
          'Total Primarios No Peligrosos (Reciclables, No Reciclables)','Total Primarios Peligrosos (Reciclables, No Reciclables)','Total Secundarios (Reciclables, No Reciclables)','Total Terciarios (Reciclables, No Reciclables)','Papel / cartón UF TOTAL (Reciclables)',
          'Metal UF TOTAL (Reciclables)','Plastico UF TOTAL (Reciclables)','NR.Total UF (No Reciclables)','Total UF (Reciclables, No Reciclables)','Papel / cartón Neto CLP (Reciclables)','Metal  Neto CLP (Reciclables)','Plastico Neto CLP (Reciclables)',
          'NR Neto CLP (No Reciclables)','Total Neto(CLP) (Reciclables, No Reciclables)','TOTAL NETO + IVA (Reciclables, No Reciclables)'
        ];

        for (let i = 0; i < claves.length; i++) {
          if (i < 24) {
            this.resumen.push({
              'Items': claves[i],
              'Valor': this.setFormato(this.valores[i])
            });
          }
          else {
            this.resumen.push({
              'Items': claves[i],
              'Valor': '$' + this.setFormato(this.valores[i])
            });
          }

        }

        const libro = XLSX.utils.book_new();
        const hoja = XLSX.utils.json_to_sheet(this.datos);
        const hojaResumen = XLSX.utils.json_to_sheet(this.resumen);

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

        let objectMaxLengthResumen: number[] = [];
        for (let i = 0; i < this.resumen.length; i++) {
          let value = <any>Object.values(this.resumen[i]);
          for (let j = 0; j < value.length; j++) {
            objectMaxLengthResumen[j] = 70;
          }
        }

        var wscolsResumen = [];
        for (let i = 0; i < objectMaxLengthResumen.length; i++) {
          wscolsResumen.push({ width: objectMaxLengthResumen[i] });
        }
        hojaResumen["!cols"] = wscolsResumen;

        XLSX.utils.book_append_sheet(libro, hoja, 'Datos');
        XLSX.utils.book_append_sheet(libro, hojaResumen, 'Resumen totalizadores');
        XLSX.writeFile(libro, `${nombreArchivo}_${y}.xlsx`);
        this.ls.createLog.subscribe(r => { });
        Swal.close();
        this.datos = []
        this.resumen = []
        this.valores = new Array(29).fill(0);
      }
      else {
        this.ls.errorLog('No se encuentran declaraciones asociadas al año seleccionado').subscribe(r => { });
        Swal.fire({
          title: '¡Ups!',
          icon: 'warning',
          text: 'No se encuentran declaraciones asociadas al año seleccionado.',
          showConfirmButton: true
        });
      }
    } catch (error) {
      this.ls.errorLog('Ha sucedido un error al generar el archivo Excel, por favor pruebe de nuevo en unos minutos. Si el problema persiste póngase en contacto con administración').subscribe(r => { });
      Swal.fire({
        title: '¡Ups!',
        icon: 'error',
        text: 'Ha sucedido un error al generar el archivo Excel, por favor pruebe de nuevo en unos minutos. Si el problema persiste póngase en contacto con administración.',
        showConfirmButton: true
      });
      console.log(error);
    }
  }

  setFormato(num: number | string): string {
    const numero = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    const decimal = Math.round(numero * 100) / 100;
    const [entero, decimales] = decimal.toString().split('.');
    const enteroConPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return decimales && decimales !== '0' ? `${enteroConPuntos},${decimales.padEnd(2, '0')}` : enteroConPuntos;
  }
  setDeclaration(datos: any) {
    const { RECYCLABILITY, TYPE_RESIDUE, HAZARD, PRECEDENCE, VALUE, AMOUNT } = datos;

    if (RECYCLABILITY == 1) {
      TYPE_RESIDUE == 1
        ? HAZARD == 1
          ? PRECEDENCE == 1
            ? (this.R_PapelCarton_P = VALUE)
            : PRECEDENCE == 2
              ? (this.R_PapelCarton_Sec = VALUE)
              : (this.R_PapelCarton_Ter = VALUE)
          : (this.R_PapelCarton_NP = VALUE)
        : TYPE_RESIDUE == 2
          ? HAZARD == 1
            ? PRECEDENCE == 1
              ? (this.R_Metal_P = VALUE)
              : PRECEDENCE == 2
                ? (this.R_Metal_Sec = VALUE)
                : (this.R_Metal_Ter = VALUE)
            : (this.R_Metal_NP = VALUE)
          : TYPE_RESIDUE == 3
            ? HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.R_Plastico_P = VALUE)
                : PRECEDENCE == 2
                  ? (this.R_Plastico_Sec = VALUE)
                  : (this.R_Plastico_Ter = VALUE)
              : (this.R_Plastico_NP = VALUE)
            : TYPE_RESIDUE == 4 &&
            (HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.R_Madera_P = VALUE)
                : PRECEDENCE == 2
                  ? (this.R_Madera_Sec = VALUE)
                  : (this.R_Madera_Ter = VALUE)
              : (this.R_Madera_NP = VALUE));

      this.R_Total_Ton += VALUE;
      if (TYPE_RESIDUE != 4) {
        this.R_Total_UF += AMOUNT;
      }
    } else if (RECYCLABILITY == 2) {
      TYPE_RESIDUE == 1
        ? HAZARD == 1
          ? PRECEDENCE == 1
            ? (this.NR_PapelCarton_P = VALUE)
            : PRECEDENCE == 2
              ? (this.NR_PapelCarton_Sec = VALUE)
              : (this.NR_PapelCarton_Ter = VALUE)
          : (this.NR_PapelCarton_NP = VALUE)
        : TYPE_RESIDUE == 2
          ? HAZARD == 1
            ? PRECEDENCE == 1
              ? (this.NR_Metal_P = VALUE)
              : PRECEDENCE == 2
                ? (this.NR_Metal_Sec = VALUE)
                : (this.NR_Metal_Ter = VALUE)
            : (this.NR_Metal_NP = VALUE)
          : TYPE_RESIDUE == 3
            ? HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.NR_Plastico_P = VALUE)
                : PRECEDENCE == 2
                  ? (this.NR_Plastico_Sec = VALUE)
                  : (this.NR_Plastico_Ter = VALUE)
              : (this.NR_Plastico_NP = VALUE)
            : TYPE_RESIDUE == 4
              ? HAZARD == 1
                ? PRECEDENCE == 1
                  ? (this.NR_Madera_P = VALUE)
                  : PRECEDENCE == 2
                    ? (this.NR_Madera_Sec = VALUE)
                    : (this.NR_Madera_Ter = VALUE)
                : (this.NR_Madera_NP = VALUE)
              : TYPE_RESIDUE == 5 &&
              (HAZARD == 1
                ? PRECEDENCE == 1
                  ? (this.NR_Compuestos_P = VALUE)
                  : PRECEDENCE == 2
                    ? (this.NR_Compuestos_Sec = VALUE)
                    : (this.NR_Compuestos_Ter = VALUE)
                : (this.NR_Compuestos_NP = VALUE));

      this.NR_Total_Ton += VALUE;
      if (TYPE_RESIDUE != 4) {
        this.NR_Total_UF += AMOUNT;
      }
    } else {
      TYPE_RESIDUE == 1
        ? HAZARD == 1
          ? PRECEDENCE == 1
            ? (this.RET_PapelCarton_P = VALUE)
            : PRECEDENCE == 2
              ? (this.RET_PapelCarton_Sec = VALUE)
              : (this.RET_PapelCarton_Ter = VALUE)
          : (this.RET_PapelCarton_NP = VALUE)
        : TYPE_RESIDUE == 2
          ? HAZARD == 1
            ? PRECEDENCE == 1
              ? (this.RET_Metal_P = VALUE)
              : PRECEDENCE == 2
                ? (this.RET_Metal_Sec = VALUE)
                : (this.RET_Metal_Ter = VALUE)
            : (this.RET_Metal_NP = VALUE)
          : TYPE_RESIDUE == 3
            ? HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.RET_Plastico_P = VALUE)
                : PRECEDENCE == 2
                  ? (this.RET_Plastico_Sec = VALUE)
                  : (this.RET_Plastico_Ter = VALUE)
              : (this.RET_Plastico_NP = VALUE)
            : TYPE_RESIDUE == 4 &&
            (HAZARD == 1
              ? PRECEDENCE == 1
                ? (this.RET_Madera_P = VALUE)
                : PRECEDENCE == 2
                  ? (this.RET_Madera_Sec = VALUE)
                  : (this.RET_Madera_Ter = VALUE)
              : (this.RET_Madera_NP = VALUE));
      this.RET_Total_Ton += VALUE;
      this.RET_Total_UF += AMOUNT;
    }
  }

  resetDatos() {
    this.R_PapelCarton_NP = 0; this.R_PapelCarton_P = 0; this.R_PapelCarton_Sec = 0; this.R_PapelCarton_Ter = 0;
    this.R_Metal_NP = 0; this.R_Metal_P = 0; this.R_Metal_Sec = 0; this.R_Metal_Ter = 0;
    this.R_Plastico_NP = 0; this.R_Plastico_P = 0; this.R_Plastico_Sec = 0; this.R_Plastico_Ter = 0;
    this.R_Madera_NP = 0; this.R_Madera_P = 0; this.R_Madera_Sec = 0; this.R_Madera_Ter = 0;
    this.R_Total_Ton = 0; this.R_Total_UF = 0;
    this.NR_PapelCarton_NP = 0; this.NR_PapelCarton_P = 0; this.NR_PapelCarton_Sec = 0; this.NR_PapelCarton_Ter = 0;
    this.NR_Metal_P = 0; this.NR_Metal_NP = 0; this.NR_Metal_Sec = 0; this.NR_Metal_Ter = 0;
    this.NR_Plastico_NP = 0; this.NR_Plastico_P = 0; this.NR_Plastico_Sec = 0; this.NR_Plastico_Ter = 0;
    this.NR_Madera_NP = 0; this.NR_Madera_P = 0; this.NR_Madera_Sec = 0; this.NR_Madera_Ter = 0;
    this.NR_Compuestos_NP = 0; this.NR_Compuestos_P = 0; this.NR_Compuestos_Sec = 0; this.NR_Compuestos_Ter = 0;
    this.NR_Total_Ton = 0; this.NR_Total_UF = 0;
    this.RET_PapelCarton_NP = 0; this.RET_PapelCarton_P = 0; this.RET_PapelCarton_Sec = 0; this.RET_PapelCarton_Ter = 0;
    this.RET_Metal_NP = 0; this.RET_Metal_P = 0; this.RET_Metal_Sec = 0; this.RET_Metal_Ter = 0;
    this.RET_Plastico_NP = 0; this.RET_Plastico_P = 0; this.RET_Plastico_Sec = 0; this.RET_Plastico_Ter = 0;
    this.RET_Madera_NP = 0; this.RET_Madera_P = 0; this.RET_Madera_Sec = 0; this.RET_Madera_Ter = 0;
    this.RET_Total_Ton = 0; this.RET_Total_UF = 0;


    this.Total_EyE = 0;
    this.TotalBruto = 0; this.TotalBruto_IVA = 0;

    this.R_PapelCarton_Total = 0; this.R_Metal_Total = 0; this.R_Plastico_Total = 0;
    this.R_Madera_Total = 0; this.NR_PapelCarton_Total = 0; this.NR_Metal_Total = 0;
    this.NR_Plastico_Total = 0; this.NR_Madera_Total = 0; this.NR_Compuestos_Total = 0;
    this.RET_PapelCarton_Total = 0; this.RET_Metal_Total = 0; this.RET_Plastico_Total = 0;
    this.RET_Madera_Total = 0; this.EyE_PapelCarton_Rec = 0; this.EyE_Metal_Rec = 0;
    this.EyE_Plastico_Rec = 0; this.EyE_NR = 0; this.EyE_Ret = 0; this.PapelCarton_Rec_Uf = 0;
    this.Metal_Rec_Uf = 0; this.Plastico_Rec_Uf = 0; this.NR_Uf = 0;
    this.Total_Uf = 0; 

    this.PapelCarton_Neto = 0; this.Metal_Neto = 0;
    this.Plastico_Neto = 0; this.NR_Neto = 0; this.PapelCarton_Bruto = 0;
    this.Metal_Bruto = 0; this.Plastico_Bruto = 0; this.NR_Bruto = 0;

    this.PapelCarton_IVA = 0;
    this.Metal_IVA = 0;
    this.Plastico_IVA = 0;
    this.NR_IVA = 0;
    this.totalIVA = 0;
  }

  calculoAjustes(year: string = "", state: number) {
    if (year != "") {
      this.ratesUF = this.allUF.find(r => r.date == year);
    }

    this.R_PapelCarton_Total = this.R_PapelCarton_P + this.R_PapelCarton_Sec + this.R_PapelCarton_Ter + this.R_PapelCarton_NP;
    this.R_Metal_Total = this.R_Metal_P + this.R_Metal_Sec + this.R_Metal_Ter + this.R_Metal_NP;
    this.R_Plastico_Total = this.R_Plastico_P + this.R_Plastico_Sec + this.R_Plastico_Ter + this.R_Plastico_NP;
    this.R_Madera_Total = this.R_Madera_P + this.R_Madera_Sec + this.R_Madera_Ter + this.R_Madera_NP;
    this.NR_PapelCarton_Total = this.NR_PapelCarton_P + this.NR_PapelCarton_Sec + this.NR_PapelCarton_Ter + this.NR_PapelCarton_NP;
    this.NR_Metal_Total = this.NR_Metal_P + this.NR_Metal_Sec + this.NR_Metal_Ter + this.NR_Metal_NP;
    this.NR_Plastico_Total = this.NR_Plastico_P + this.NR_Plastico_Sec + this.NR_Plastico_Ter + this.NR_Plastico_NP;
    this.NR_Madera_Total = this.NR_Madera_P + this.NR_Madera_Sec + this.NR_Madera_Ter + this.NR_Madera_NP;
    this.NR_Compuestos_Total = this.NR_Compuestos_P + this.NR_Compuestos_Sec + this.NR_Compuestos_Ter + this.NR_Compuestos_NP;
    this.RET_PapelCarton_Total = this.RET_PapelCarton_P + this.RET_PapelCarton_Sec + this.RET_PapelCarton_Ter + this.RET_PapelCarton_NP;
    this.RET_Metal_Total = this.RET_Metal_P + this.RET_Metal_Sec + this.RET_Metal_Ter + this.RET_Metal_NP;
    this.RET_Plastico_Total = this.RET_Plastico_P + this.RET_Plastico_Sec + this.RET_Plastico_Ter + this.RET_Plastico_NP;
    this.RET_Madera_Total = this.RET_Madera_P + this.RET_Madera_Sec + this.RET_Madera_Ter + this.RET_Madera_NP;

    this.EyE_PapelCarton_Rec = this.R_PapelCarton_Total;
    this.EyE_Metal_Rec = this.R_Metal_Total;
    this.EyE_Plastico_Rec = this.R_Plastico_Total;
    this.EyE_NR = this.NR_PapelCarton_Total + this.NR_Metal_Total + this.NR_Plastico_Total + this.NR_Compuestos_Total;
    this.EyE_Ret = this.RET_Total_Ton;

    this.Total_EyE = this.EyE_PapelCarton_Rec + this.EyE_Metal_Rec + this.EyE_Plastico_Rec + this.EyE_NR;

   this.PapelCarton_Rec_Uf = this.EyE_PapelCarton_Rec * this.rates[0].price;
    this.Metal_Rec_Uf = this.EyE_Metal_Rec * this.rates[1].price;
    this.Plastico_Rec_Uf = this.EyE_Plastico_Rec * this.rates[2].price;
    this.NR_Uf = this.EyE_NR * this.rates[3].price;
    this.Total_Uf = this.PapelCarton_Rec_Uf + this.Metal_Rec_Uf + this.Plastico_Rec_Uf + this.NR_Uf;

    this.PapelCarton_Neto = (this.PapelCarton_Rec_Uf * this.ratesUF.data).toFixed(0);
    this.Metal_Neto = (this.Metal_Rec_Uf * this.ratesUF.data).toFixed(0);
    this.Plastico_Neto = (this.Plastico_Rec_Uf * this.ratesUF.data).toFixed(0);
    this.NR_Neto = (this.NR_Uf * this.ratesUF.data).toFixed(0);

    this.PapelCarton_IVA = this.PapelCarton_Rec_Uf * this.ratesUF.data * 1.19 - this.PapelCarton_Rec_Uf * this.ratesUF.data;
    this.Metal_IVA = this.Metal_Rec_Uf * this.ratesUF.data * 1.19 - this.Metal_Rec_Uf * this.ratesUF.data;
    this.Plastico_IVA = this.Plastico_Rec_Uf * this.ratesUF.data * 1.19 - this.Plastico_Rec_Uf * this.ratesUF.data;
    this.NR_IVA = this.NR_Uf * this.ratesUF.data * 1.19 - this.NR_Uf * this.ratesUF.data;

    this.PapelCarton_Bruto = (this.PapelCarton_Rec_Uf * this.ratesUF.data * 1.19).toFixed(0);
    this.Metal_Bruto = (this.Metal_Rec_Uf * this.ratesUF.data * 1.19).toFixed(0);
    this.Plastico_Bruto = (this.Plastico_Rec_Uf * this.ratesUF.data * 1.19).toFixed(0);
    this.NR_Bruto = (this.NR_Uf * this.ratesUF.data * 1.19).toFixed(0);

    this.totalIVA = this.PapelCarton_IVA + this.Metal_IVA + this.Plastico_IVA + this.NR_IVA;
    this.TotalBruto = parseInt(this.PapelCarton_Neto) + parseInt(this.Metal_Neto) + parseInt(this.Plastico_Neto) + parseInt(this.NR_Neto);
    this.TotalBruto_IVA = parseInt(this.PapelCarton_Bruto) + parseInt(this.Metal_Bruto) + parseInt(this.Plastico_Bruto) + parseInt(this.NR_Bruto);
    if (state != 0) {
      this.valores[0] = this.valores[0] + parseFloat(this.Total_EyE) + parseFloat(this.EyE_Ret);
      this.valores[1] = this.valores[1] + parseFloat(this.Total_EyE);
      this.valores[2] = this.valores[2] + parseFloat(this.R_PapelCarton_Total) + parseFloat(this.NR_PapelCarton_Total) + parseFloat(this.RET_PapelCarton_Total);
      this.valores[3] = this.valores[3] + parseFloat(this.R_Metal_Total) + parseFloat(this.NR_Metal_Total) + parseFloat(this.RET_Metal_Total);
      this.valores[4] = this.valores[4] + parseFloat(this.R_Plastico_Total) + parseFloat(this.NR_Plastico_Total) + parseFloat(this.RET_Plastico_Total);
      this.valores[5] = this.valores[5] + parseFloat(this.R_Madera_Total) + parseFloat(this.NR_Madera_Total) + parseFloat(this.RET_Madera_Total);
      this.valores[6] = this.valores[6] + parseFloat(this.R_PapelCarton_Total) + parseFloat(this.NR_PapelCarton_Total);
      this.valores[7] = this.valores[7] + parseFloat(this.R_Metal_Total) + parseFloat(this.NR_Metal_Total);
      this.valores[8] = this.valores[8] + parseFloat(this.R_Plastico_Total) + parseFloat(this.NR_Plastico_Total);
      this.valores[9] = this.valores[9] + parseFloat(this.R_Madera_Total) + parseFloat(this.NR_Madera_Total);
      this.valores[10] = this.valores[10] +  parseFloat(this.NR_Compuestos_Total);
      this.valores[11] = this.valores[11] + parseFloat(this.R_PapelCarton_Total);
      this.valores[12] = this.valores[12] + parseFloat(this.R_Metal_Total);
      this.valores[13] = this.valores[13] + parseFloat(this.R_Plastico_Total);
      this.valores[14] = this.valores[14] +  parseFloat(this.NR_PapelCarton_Total)+ parseFloat(this.NR_Metal_Total )+ parseFloat(this.NR_Plastico_Total)+ parseFloat(this.NR_Compuestos_Total);
      this.valores[15] = this.valores[15] + parseFloat(this.R_PapelCarton_NP) + parseFloat(this.R_Metal_NP) + parseFloat(this.R_Plastico_NP) + parseFloat(this.R_Madera_NP) + parseFloat(this.NR_PapelCarton_NP) + parseFloat(this.NR_Metal_NP) + parseFloat(this.NR_Plastico_NP) + parseFloat(this.NR_Madera_NP) + parseFloat(this.NR_Compuestos_NP);
      this.valores[16] = this.valores[16] + parseFloat(this.R_PapelCarton_P) + parseFloat(this.R_Metal_P) + parseFloat(this.R_Plastico_P) + parseFloat(this.R_Madera_P) + parseFloat(this.NR_PapelCarton_P) + parseFloat(this.NR_Metal_P) + parseFloat(this.NR_Plastico_P) + parseFloat(this.NR_Madera_P) + parseFloat(this.NR_Compuestos_P);
      this.valores[17] = this.valores[17] + parseFloat(this.R_PapelCarton_Sec) + parseFloat(this.R_Metal_Sec) + parseFloat(this.R_Plastico_Sec) + parseFloat(this.R_Madera_Sec) + parseFloat(this.NR_PapelCarton_Sec) + parseFloat(this.NR_Metal_Sec) + parseFloat(this.NR_Plastico_Sec) + parseFloat(this.NR_Madera_Sec) + parseFloat(this.NR_Compuestos_Sec);
      this.valores[18] = this.valores[18] + parseFloat(this.R_PapelCarton_Ter) + parseFloat(this.R_Metal_Ter) + parseFloat(this.R_Plastico_Ter) + parseFloat(this.R_Madera_Ter) + parseFloat(this.NR_PapelCarton_Ter) + parseFloat(this.NR_Metal_Ter) + parseFloat(this.NR_Plastico_Ter) + parseFloat(this.NR_Madera_Ter) + parseFloat(this.NR_Compuestos_Ter);
      this.valores[19] = this.valores[19] + parseFloat(this.PapelCarton_Rec_Uf);
      this.valores[20] = this.valores[20] + parseFloat(this.Metal_Rec_Uf);
      this.valores[21] = this.valores[21] + parseFloat(this.Plastico_Rec_Uf);
      this.valores[22] = this.valores[22] + parseFloat(this.NR_Uf);
      this.valores[23] = this.valores[23] + parseFloat(this.Total_Uf);
      this.valores[24] = this.valores[24] + parseFloat(this.PapelCarton_Neto);
      this.valores[25] = this.valores[25] + parseFloat(this.Metal_Neto);
      this.valores[26] = this.valores[26] + parseFloat(this.Plastico_Neto);
      this.valores[27] = this.valores[27] + parseFloat(this.NR_Neto);
      this.valores[28] = this.valores[28] + parseFloat(this.TotalBruto);
      this.valores[29] = this.valores[29] + parseFloat(this.TotalBruto_IVA);
    }
  }
}
