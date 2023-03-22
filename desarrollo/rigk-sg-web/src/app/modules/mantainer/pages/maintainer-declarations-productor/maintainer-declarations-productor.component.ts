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
  R_PapelCarton_Total: any = 0;
  R_Metal_NP: any = 0;
  R_Metal_P: any = 0;
  R_Metal_ST: any = 0;
  R_Metal_Total: any = 0;
  R_Plastico_NP: any = 0;
  R_Plastico_P: any = 0;
  R_Plastico_ST: any = 0;
  R_Plastico_Total: any = 0;
  R_Madera_NP: any = 0;
  R_Madera_P: any = 0;
  R_Madera_ST: any = 0;
  R_Madera_Total: any = 0;
  R_Total_Ton: any = 0;
  R_Total_UF: any = 0;
  NR_PapelCarton_NP: any = 0;
  NR_PapelCarton_P: any = 0;
  NR_PapelCarton_ST: any = 0;
  NR_PapelCarton_Total: any = 0;
  NR_Metal_P: any = 0;
  NR_Metal_NP: any = 0;
  NR_Metal_ST: any = 0;
  NR_Metal_Total: any = 0;
  NR_Plastico_NP: any = 0;
  NR_Plastico_P: any = 0;
  NR_Plastico_ST: any = 0;
  NR_Plastico_Total: any = 0;
  NR_Madera_NP: any = 0;
  NR_Madera_P: any = 0;
  NR_Madera_ST: any = 0;
  NR_Madera_Total: any = 0;
  NR_Compuestos_NP: any = 0;
  NR_Compuestos_P: any = 0;
  NR_Compuestos_ST: any = 0;
  NR_Compuestos_Total: any = 0;
  NR_Total_Ton: any = 0;
  NR_Total_UF: any = 0;
  RET_PapelCarton_NP: any = 0;
  RET_PapelCarton_P: any = 0;
  RET_PapelCarton_ST: any = 0;
  RET_PapelCarton_Total: any = 0;
  RET_Metal_NP: any = 0;
  RET_Metal_P: any = 0;
  RET_Metal_ST: any = 0;
  RET_Metal_Total: any = 0;
  RET_Plastico_NP: any = 0;
  RET_Plastico_P: any = 0;
  RET_Plastico_ST: any = 0;
  RET_Plastico_Total: any = 0;
  RET_Madera_NP: any = 0;
  RET_Madera_P: any = 0;
  RET_Madera_ST: any = 0;
  RET_Madera_Total: any = 0;
  RET_Total_Ton: any = 0;
  RET_Total_UF: any = 0;
  EyE_PapelCarton_Rec: any = 0;
  EyE_Metal_Rec: any = 0;
  EyE_Plastico_Rec: any = 0;
  EyE_NR: any = 0;
  EyE_Ret: any = 0;
  Total_EyE: any = 0;
  Ajuste_PapelCarton_Reciclable_Ton: any = 0;
  Ajuste_Metal_Reciclable_Ton: any = 0;
  Ajuste_Plastico_Reciclable_Ton: any = 0;
  Ajuste_No_Reciclables_Ton: any = 0;
  Ajuste_Retornables_Ton: any = 0;
  Total_Ajuste: any = 0;
  Ajuste_PapelCarton_Reciclable_UF: any = 0;
  Ajuste_Metal_Reciclable_UF: any = 0;
  Ajuste_Plastico_Reciclable_UF: any = 0;
  Ajuste_No_Reciclables_UF: any = 0;
  EyE_PapelCarton_Rec_Total: any = 0;
  EyE_Metal_Rec_Total: any = 0;
  EyE_Plastico_Rec_Total: any = 0;
  EyE_NR_Total: any = 0;
  EyE_Ret_Total: any = 0;
  PapelCarton_Rec_Uf: any = 0;
  Metal_Rec_Uf: any = 0;
  Plastico_Rec_Uf: any = 0;
  NR_Uf: any = 0;
  PapelCarton_Rec_Uf_Corregido: any = 0;
  Metal_Rec_Uf_Corregido: any = 0;
  Plastico_Rec_Uf_Corregido: any = 0;
  NR_Uf_Corregido: any = 0;
  PapelCarton_Neto: any = 0;
  Metal_Neto: any = 0;
  Plastico_Neto: any = 0;
  NR_Neto: any = 0;
  PapelCarton_Bruto: any = 0;
  Metal_Bruto: any = 0;
  Plastico_Bruto: any = 0;
  NR_Bruto: any = 0;

  Total_Peso: any = 0;
  TotalCorregido: any = 0;
  TotalBruto: any = 0;
  TotalBruto_IVA: any = 0;
  Total_Uf: any = 0;
  Total_Ajuste_Uf: any = 0;

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
  selectedYear: number = -1;
  listBusiness: any[] = [];
  listStatements: any[] = [];
  filteredListBusiness: any[] = [];
  //Automatizado para años posteriores
  constructor(private businesService: BusinessService,
    public productorService: ProductorService,
    public ratesService: RatesTsService) {
    const currentYear = new Date().getFullYear();
    for (let year = 1900; year <= currentYear + 1; year++) {
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

  delay = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));

  generarExcel = async (nombreArchivo: string) => {
    try {
      const y = parseInt((document.getElementById('f_year') as HTMLSelectElement).value);
      // Esperar a que se complete la petición y obtener los datos
      const r = await this.productorService.getAllStatementByYear(y).toPromise();
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

        const getDetailsAndValues = async (statement: { ID_HEADER: number; CODE_BUSINESS: any; CREATED_BY: number; }) => {
          const [f, lt, user] = await Promise.all([
            this.productorService.getDetailByIdHeader(statement.ID_HEADER).toPromise(),
            this.productorService.getValueStatementByYear(statement.CODE_BUSINESS, y - 1, 0).toPromise(),
            this.productorService.getProductor(statement.CREATED_BY).toPromise()
          ]);
          return { f, lt, user };
        };

        for (const statement of this.listStatements) {
          const { f, lt, user } = await getDetailsAndValues(statement);

          if (lt.status) {
            lt.data.detail.forEach((detail: any) => {
              this.setLastDeclaration(detail);
            });
          }
          f.data.forEach((detail: any) => {
            this.setDeclaration(detail);
          });


          if (statement.STATE) {
            const fechaFormateada = new Date(statement.UPDATED_AT).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
            this.ratesUF = await this.ratesService.getUfDate(fechaFormateada).toPromise();
            this.calculoAjustes();

            const fecha = statement.UPDATED_AT;
            const fechaFormateada__excel = new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            this.datos.push({
              'ID empresa': statement.CODE_BUSINESS, 'Nombre empresa': statement.NAME, 'Año declaración': y.toString(), 'Estado declaración': 'Enviada',
              'Fecha de envío': fechaFormateada__excel, 'Usuario': user.data.statements[0].FIRST_NAME + ' ' + user.data.statements[0].LAST_NAME, 'R. Papel/cartón NP': this.setFormato(this.R_PapelCarton_NP),
              'R. Papel/cartón P': this.setFormato(this.R_PapelCarton_P), 'R. Papel/cartón ST': this.setFormato(this.R_PapelCarton_ST), 'R. Papel/cartón TOTAL': this.setFormato(this.R_PapelCarton_Total), 'R. Metal NP': this.setFormato(this.R_Metal_NP), 'R. Metal P': this.setFormato(this.R_Metal_P), 'R. Metal ST': this.setFormato(this.R_Metal_ST), 'R. Metal TOTAL': this.setFormato(this.R_Metal_Total),
              'R. Plástico NP': this.setFormato(this.R_Plastico_NP), 'R. Plástico P': this.setFormato(this.R_Plastico_P), 'R. Plástico ST': this.setFormato(this.R_Plastico_ST), 'R. Plástico TOTAL': this.setFormato(this.R_Plastico_Total), 'R. Madera NP': this.setFormato(this.R_Madera_NP), 'R. Madera P': this.setFormato(this.R_Madera_P), 'R. Madera ST': this.setFormato(this.R_Madera_ST), 'R. Madera TOTAL': this.setFormato(this.R_Madera_Total),
              'R. Total Ton': this.setFormato(this.R_Total_Ton), 'R. Total UF': this.setFormato(this.R_Total_UF), 'NR. Papel/cartón NP': this.setFormato(this.NR_PapelCarton_NP), 'NR. Papel/cartón P': this.setFormato(this.NR_PapelCarton_P), 'NR. Papel/cartón ST': this.setFormato(this.NR_PapelCarton_ST), 'NR. Papel/cartón Total': this.setFormato(this.NR_PapelCarton_Total),
              'NR. Metal NP': this.setFormato(this.NR_Metal_NP), 'NR. Metal P': this.setFormato(this.NR_Metal_P), 'NR. Metal ST': this.setFormato(this.NR_Metal_ST), 'NR. Metal Total': this.setFormato(this.NR_Metal_Total), 'NR. Plástico NP': this.setFormato(this.NR_Plastico_NP), 'NR. Plástico P': this.setFormato(this.NR_Plastico_P), 'NR. Plástico ST': this.setFormato(this.NR_Plastico_ST), 'NR. Plástico Total': this.setFormato(this.NR_Plastico_Total),
              'NR. Madera NP': this.setFormato(this.NR_Madera_NP), 'NR. Madera P': this.setFormato(this.NR_Madera_P), 'NR. Madera ST': this.setFormato(this.NR_Madera_ST), 'NR. Madera Total': this.setFormato(this.NR_Madera_Total), 'NR. Compuestos NP': this.setFormato(this.NR_Compuestos_NP), 'NR. Compuestos P': this.setFormato(this.NR_Compuestos_P), 'NR. Compuestos ST': this.setFormato(this.NR_Compuestos_ST), 'NR. Compuestos Total': this.setFormato(this.NR_Compuestos_Total),
              'NR. Total Ton': this.setFormato(this.NR_Total_Ton), 'NR. Total UF': this.setFormato(this.NR_Total_UF), 'RET. Papel/cartón NP': this.setFormato(this.RET_PapelCarton_NP), 'RET. Papel/cartón P': this.setFormato(this.RET_PapelCarton_P), 'RET. Papel/cartón ST': this.setFormato(this.RET_PapelCarton_ST), 'RET. Papel/cartón Total': this.setFormato(this.RET_PapelCarton_Total),
              'RET. Metal NP': this.setFormato(this.RET_Metal_NP), 'RET. Metal P': this.setFormato(this.RET_Metal_P), 'RET. Metal ST': this.setFormato(this.RET_Metal_ST), 'RET. Metal Total': this.setFormato(this.RET_Metal_Total), 'RET. Plástico NP': this.setFormato(this.RET_Plastico_NP), 'RET. Plástico P': this.setFormato(this.RET_Plastico_P), 'RET. Plástico ST': this.setFormato(this.RET_Plastico_ST), 'RET. Plástico Total': this.setFormato(this.RET_Plastico_Total),
              'RET. Madera NP': this.setFormato(this.RET_Madera_NP), 'RET. Madera P': this.setFormato(this.RET_Madera_P), 'RET. Madera ST': this.setFormato(this.RET_Madera_ST), 'RET. Madera Total': this.setFormato(this.RET_Madera_Total), 'RET. Total Ton': this.setFormato(this.RET_Total_Ton), 'RET. Total UF': this.setFormato(this.RET_Total_UF),
              'EyE Papel/cartón Rec': this.setFormato(this.EyE_PapelCarton_Rec), 'EyE Metal Rec': this.setFormato(this.EyE_Metal_Rec), 'EyE Plastico Rec': this.setFormato(this.EyE_Plastico_Rec), 'EyE NR': this.setFormato(this.EyE_NR), 'EyE Ret': this.setFormato(this.EyE_Ret), 'TOTAL EyE': this.setFormato(this.Total_EyE),
              'Papel/cartón Rec UF': this.setFormato(this.PapelCarton_Rec_Uf), 'Metal Rec UF': this.setFormato(this.Metal_Rec_Uf), 'Plastico Rec UF': this.setFormato(this.Plastico_Rec_Uf), 'NR UF': this.setFormato(this.NR_Uf), 'TOTAL Uf': this.setFormato(this.Total_Uf), 'Ajuste Papel/Cartón Reciclable Ton': this.setFormato(this.Ajuste_PapelCarton_Reciclable_Ton), 'Ajuste Metal Reciclable Ton': this.setFormato(this.Ajuste_Metal_Reciclable_Ton),
              'Ajuste Plástico Reciclable Ton': this.setFormato(this.Ajuste_Plastico_Reciclable_Ton), 'Ajuste No Reciclables Ton': this.setFormato(this.Ajuste_No_Reciclables_Ton), 'Ajuste Retornables Ton': this.setFormato(this.Ajuste_Retornables_Ton), 'Total Ajuste': this.setFormato(this.Total_Ajuste),
              'EyE Papel/cartón Rec Total': this.setFormato(this.EyE_PapelCarton_Rec_Total), 'EyE Metal Rec Total': this.setFormato(this.EyE_Metal_Rec_Total), 'EyE Plastico Rec Total': this.setFormato(this.EyE_Plastico_Rec_Total), 'EyE NR Total': this.setFormato(this.EyE_NR_Total), 'EyE Ret Total': this.setFormato(this.EyE_Ret_Total), 'TOTAL PESO': this.setFormato(this.Total_Peso),
              'Ajuste Papel/Cartón Reciclable UF': this.setFormato(this.Ajuste_PapelCarton_Reciclable_UF), 'Ajuste Metal Reciclable UF': this.setFormato(this.Ajuste_Metal_Reciclable_UF),
              'Ajuste Plástico Reciclable UF': this.setFormato(this.Ajuste_Plastico_Reciclable_UF), 'Ajuste No Reciclables UF': this.setFormato(this.Ajuste_No_Reciclables_UF),
              'Total Ajuste UF': this.setFormato(this.Total_Ajuste_Uf), 'Papel/cartón Rec UF TOTAL': this.setFormato(this.PapelCarton_Rec_Uf_Corregido), 'Metal Rec UF TOTAL': this.setFormato(this.Metal_Rec_Uf_Corregido), 'Plastico Rec UF TOTAL': this.setFormato(this.Plastico_Rec_Uf_Corregido), 'NR UF TOTAL': this.setFormato(this.NR_Uf_Corregido), 'Total corregido (UF)': this.setFormato(this.TotalCorregido),
              'Papel/cartón Neto CLP': this.setFormato(this.PapelCarton_Neto),'Metal Rec UF Neto CLP': this.setFormato(this.Metal_Neto),'Plastico Rec UF Neto CLP': this.setFormato(this.Plastico_Neto),'NR UF Neto CLP': this.setFormato(this.NR_Neto),'Total Neto (CLP)': this.setFormato(this.TotalBruto),
              'Papel/cartón Bruto CLP': this.setFormato(this.PapelCarton_Bruto),'Metal Rec UF Bruto CLP': this.setFormato(this.Metal_Bruto),'Plastico Rec UF Bruto CLP': this.setFormato(this.Plastico_Bruto),'NR UF Bruto CLP': this.setFormato(this.NR_Bruto),'Total Bruto (CLP) + IVA': this.setFormato(this.TotalBruto_IVA)
            });
          }
          else {
            this.datos.push({
              'ID empresa': statement.CODE_BUSINESS, 'Nombre empresa': statement.NAME, 'Año declaración': y.toString(), 'Estado declaración': 'Borrador',
              'Fecha de envío': 'NA', 'Usuario': user.data.statements[0].FIRST_NAME + ' ' + user.data.statements[0].LAST_NAME, 'R. Papel/cartón NP':'',
              'R. Papel/cartón P': '', 'R. Papel/cartón ST': '', 'R. Papel/cartón TOTAL': '', 'R. Metal NP': '', 'R. Metal P': '', 'R. Metal ST': '', 'R. Metal TOTAL': '',
              'R. Plástico NP':'', 'R. Plástico P':'', 'R. Plástico ST':'', 'R. Plástico TOTAL':'', 'R. Madera NP':'', 'R. Madera P':'', 'R. Madera ST':'', 'R. Madera TOTAL':'',
              'R. Total Ton':'', 'R. Total UF':'', 'NR. Papel/cartón NP':'', 'NR. Papel/cartón P':'', 'NR. Papel/cartón ST':'', 'NR. Papel/cartón Total':'',
              'NR. Metal NP':'', 'NR. Metal P':'', 'NR. Metal ST':'', 'NR. Metal Total':'', 'NR. Plástico NP':'', 'NR. Plástico P':'', 'NR. Plástico ST':'', 'NR. Plástico Total':'',
              'NR. Madera NP':'', 'NR. Madera P':'', 'NR. Madera ST':'', 'NR. Madera Total':'', 'NR. Compuestos NP':'', 'NR. Compuestos P':'', 'NR. Compuestos ST':'', 'NR. Compuestos Total':'',
              'NR. Total Ton':'', 'NR. Total UF':'', 'RET. Papel/cartón NP':'', 'RET. Papel/cartón P':'', 'RET. Papel/cartón ST':'', 'RET. Papel/cartón Total':'',
              'RET. Metal NP':'', 'RET. Metal P':'', 'RET. Metal ST':'', 'RET. Metal Total':'', 'RET. Plástico NP':'', 'RET. Plástico P':'', 'RET. Plástico ST':'', 'RET. Plástico Total':'',
              'RET. Madera NP':'', 'RET. Madera P':'', 'RET. Madera ST':'', 'RET. Madera Total':'', 'RET. Total Ton':'', 'RET. Total UF':'',
              'EyE Papel/cartón Rec':'', 'EyE Metal Rec':'', 'EyE Plastico Rec':'', 'EyE NR':'', 'EyE Ret':'', 'TOTAL EyE':'',
              'Papel/cartón Rec UF':'', 'Metal Rec UF':'', 'Plastico Rec UF':'', 'NR UF':'', 'TOTAL Uf':'', 'Ajuste Papel/Cartón Reciclable Ton':'', 'Ajuste Metal Reciclable Ton':'',
              'Ajuste Plástico Reciclable Ton':'', 'Ajuste No Reciclables Ton':'', 'Ajuste Retornables Ton':'', 'Total Ajuste':'',
              'EyE Papel/cartón Rec Total':'', 'EyE Metal Rec Total':'', 'EyE Plastico Rec Total':'', 'EyE NR Total':'', 'EyE Ret Total':'', 'TOTAL PESO':'',
              'Ajuste Papel/Cartón Reciclable UF':'', 'Ajuste Metal Reciclable UF':'',
              'Ajuste Plástico Reciclable UF':'', 'Ajuste No Reciclables UF':'',
              'Total Ajuste UF':'', 'Papel/cartón Rec UF TOTAL':'', 'Metal Rec UF TOTAL':'', 'Plastico Rec UF TOTAL':'', 'NR UF TOTAL':'', 'Total corregido (UF)':'',
              'Papel/cartón Neto CLP':'','Metal Rec UF Neto CLP':'','Plastico Rec UF Neto CLP':'','NR UF Neto CLP':'','Total Neto (CLP)':'',
              'Papel/cartón Bruto CLP':'','Metal Rec UF Bruto CLP':'','Plastico Rec UF Bruto CLP':'','NR UF Bruto CLP':'','Total Bruto (CLP) + IVA':''
            });
          }
          this.resetDatos();
          await this.delay(25); // Agregue un retardo de 20 ms entre las solicitudes
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
        XLSX.writeFile(libro, `${nombreArchivo}_${y}.xlsx`);
        Swal.close();
        this.datos = []
      }
      else {
        Swal.fire({
          title: '¡Ups!',
          icon: 'warning',
          text: 'No se encuentran declaraciones asociadas al año seleccionado.',
          showConfirmButton: true
        });
      }
    } catch (error) {
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
    this.Total_Ajuste = 0;
    this.Ajuste_PapelCarton_Reciclable_UF = 0;
    this.Ajuste_Metal_Reciclable_UF = 0;
    this.Ajuste_Plastico_Reciclable_UF = 0;
    this.Ajuste_No_Reciclables_UF = 0;
    this.Total_EyE = 0;
    this.Total_Peso = 0;
    this.TotalCorregido = 0;
    this.TotalBruto = 0;
    this.TotalBruto_IVA = 0;

    this.R_PapelCarton_Total = 0;
    this.R_Metal_Total = 0;
    this.R_Plastico_Total = 0;
    this.R_Madera_Total = 0;
    this.NR_PapelCarton_Total = 0;
    this.NR_Metal_Total = 0;
    this.NR_Plastico_Total = 0;
    this.NR_Madera_Total = 0;
    this.NR_Compuestos_Total = 0;
    this.RET_PapelCarton_Total = 0;
    this.RET_Metal_Total = 0;
    this.RET_Plastico_Total = 0;
    this.RET_Madera_Total = 0;
    this.EyE_PapelCarton_Rec = 0;
    this.EyE_Metal_Rec = 0;
    this.EyE_Plastico_Rec = 0;
    this.EyE_NR = 0;
    this.EyE_Ret = 0;
    this.EyE_PapelCarton_Rec_Total = 0;
    this.EyE_Metal_Rec_Total = 0;
    this.EyE_Plastico_Rec_Total = 0;
    this.EyE_NR_Total = 0;
    this.EyE_Ret_Total = 0;
    this.PapelCarton_Rec_Uf = 0;
    this.Metal_Rec_Uf = 0;
    this.Plastico_Rec_Uf = 0;
    this.NR_Uf = 0;
    this.Total_Uf = 0;
    this.Total_Ajuste_Uf = 0;

    this.PapelCarton_Rec_Uf_Corregido = 0;
    this.Metal_Rec_Uf_Corregido = 0;
    this.Plastico_Rec_Uf_Corregido = 0;
    this.NR_Uf_Corregido = 0;
    this.PapelCarton_Neto= 0;
    this.Metal_Neto= 0;
    this.Plastico_Neto= 0;
    this.NR_Neto= 0;
    this.PapelCarton_Bruto= 0;
    this.Metal_Bruto= 0;
    this.Plastico_Bruto= 0;
    this.NR_Bruto= 0;
  }

  calculoAjustes() {

    if ((this.l_R_PapelCarton_P + this.l_R_PapelCarton_ST + this.l_R_PapelCarton_NP) != 0) {

      this.Ajuste_PapelCarton_Reciclable_Ton = this.R_PapelCarton_P + this.R_PapelCarton_ST + this.R_PapelCarton_NP - (this.l_R_PapelCarton_P + this.l_R_PapelCarton_ST + this.l_R_PapelCarton_NP)
    }
    if ((this.l_R_Metal_P + this.l_R_Metal_ST + this.l_R_Metal_NP) != 0) {
      this.Ajuste_Metal_Reciclable_Ton = this.R_Metal_P + this.R_Metal_ST + this.R_Metal_NP - (this.l_R_Metal_P + this.l_R_Metal_ST + this.l_R_Metal_NP)
    }
    if ((this.l_R_Plastico_P + this.l_R_Plastico_ST + this.l_R_Plastico_NP) != 0) {
      this.Ajuste_Plastico_Reciclable_Ton = this.R_Plastico_P + this.R_Plastico_ST + this.R_Plastico_NP - (this.l_R_Plastico_P + this.l_R_Plastico_ST + this.l_R_Plastico_NP)
    }
    if ((this.l_NR_PapelCarton_P + this.l_NR_PapelCarton_ST + this.l_NR_PapelCarton_NP + this.l_NR_Metal_P + this.l_NR_Metal_ST + this.l_NR_Metal_NP + this.l_NR_Plastico_P + this.l_NR_Plastico_ST + this.l_NR_Plastico_NP + this.l_NR_Compuestos_P + this.l_NR_Compuestos_ST + this.l_NR_Compuestos_NP) != 0) {
      this.Ajuste_No_Reciclables_Ton = this.NR_PapelCarton_P + this.NR_PapelCarton_ST + this.NR_PapelCarton_NP + this.NR_Metal_P + this.NR_Metal_ST + this.NR_Metal_NP + this.NR_Plastico_P + this.NR_Plastico_ST + this.NR_Plastico_NP + this.NR_Compuestos_P + this.NR_Compuestos_ST + this.NR_Compuestos_NP - (this.l_NR_PapelCarton_P + this.l_NR_PapelCarton_ST + this.l_NR_PapelCarton_NP + this.l_NR_Metal_P + this.l_NR_Metal_ST + this.l_NR_Metal_NP + this.l_NR_Plastico_P + this.l_NR_Plastico_ST + this.l_NR_Plastico_NP + this.l_NR_Compuestos_P + this.l_NR_Compuestos_ST + this.l_NR_Compuestos_NP);
    }
    if ((this.l_RET_PapelCarton_P + this.l_RET_PapelCarton_ST + this.l_RET_PapelCarton_NP + this.l_RET_Metal_P + this.l_RET_Metal_ST + this.l_RET_Metal_NP + this.l_RET_Plastico_P + this.l_RET_Plastico_ST + this.l_RET_Plastico_NP + this.l_RET_Madera_P + this.l_RET_Madera_ST + this.l_RET_Madera_NP) != 0) {
      this.Ajuste_Retornables_Ton = this.RET_PapelCarton_P + this.RET_PapelCarton_ST + this.RET_PapelCarton_NP + this.RET_Metal_P + this.RET_Metal_ST + this.RET_Metal_NP + this.RET_Plastico_P + this.RET_Plastico_ST + this.RET_Plastico_NP + this.RET_Madera_P + this.RET_Madera_ST + this.RET_Madera_NP - (this.l_RET_PapelCarton_P + this.l_RET_PapelCarton_ST + this.l_RET_PapelCarton_NP + this.l_RET_Metal_P + this.l_RET_Metal_ST + this.l_RET_Metal_NP + this.l_RET_Plastico_P + this.l_RET_Plastico_ST + this.l_RET_Plastico_NP + this.l_RET_Madera_P + this.l_RET_Madera_ST + this.l_RET_Madera_NP);
    }

    this.R_PapelCarton_Total = this.R_PapelCarton_P + this.R_PapelCarton_ST + this.R_PapelCarton_NP;
    this.R_Metal_Total = this.R_Metal_P + this.R_Metal_ST + this.R_Metal_NP;
    this.R_Plastico_Total = this.R_Plastico_P + this.R_Plastico_ST + this.R_Plastico_NP;
    this.R_Madera_Total = this.R_Madera_P + this.R_Madera_ST + this.R_Madera_NP;
    this.NR_PapelCarton_Total = this.NR_PapelCarton_P + this.NR_PapelCarton_ST + this.NR_PapelCarton_NP;
    this.NR_Metal_Total = this.NR_Metal_P + this.NR_Metal_ST + this.NR_Metal_NP;
    this.NR_Plastico_Total = this.NR_Plastico_P + this.NR_Plastico_ST + this.NR_Plastico_NP;
    this.NR_Madera_Total = this.NR_Madera_P + this.NR_Madera_ST + this.NR_Madera_NP;
    this.NR_Compuestos_Total = this.NR_Compuestos_P + this.NR_Compuestos_ST + this.NR_Compuestos_NP;
    this.RET_PapelCarton_Total = this.RET_PapelCarton_P + this.RET_PapelCarton_ST + this.RET_PapelCarton_NP;
    this.RET_Metal_Total = this.RET_Metal_P + this.RET_Metal_ST + this.RET_Metal_NP;
    this.RET_Plastico_Total = this.RET_Plastico_P + this.RET_Plastico_ST + this.RET_Plastico_NP;
    this.RET_Madera_Total = this.RET_Madera_P + this.RET_PapelCarton_ST + this.RET_PapelCarton_NP;

    this.EyE_PapelCarton_Rec = this.R_PapelCarton_Total;
    this.EyE_Metal_Rec = this.R_Metal_Total;
    this.EyE_Plastico_Rec = this.R_Plastico_Total;
    this.EyE_NR = this.NR_PapelCarton_Total + this.NR_Metal_Total + this.NR_Plastico_Total + this.NR_Compuestos_Total;
    this.EyE_Ret = this.RET_Total_Ton;
    this.EyE_PapelCarton_Rec_Total = this.EyE_PapelCarton_Rec + this.Ajuste_PapelCarton_Reciclable_Ton;
    this.EyE_Metal_Rec_Total = this.EyE_Metal_Rec + this.Ajuste_Metal_Reciclable_Ton;
    this.EyE_Plastico_Rec_Total = this.EyE_Plastico_Rec + this.Ajuste_Plastico_Reciclable_Ton;
    this.EyE_NR_Total = this.EyE_NR + this.Ajuste_No_Reciclables_Ton;
    this.EyE_Ret_Total = this.EyE_Ret + this.Ajuste_Retornables_Ton;

    this.Total_EyE = this.EyE_PapelCarton_Rec+ this.EyE_Metal_Rec+ this.EyE_Plastico_Rec+ this.EyE_NR;
    this.Total_Peso = this.EyE_PapelCarton_Rec_Total+ this.EyE_Metal_Rec_Total + this.EyE_Plastico_Rec_Total + this.EyE_NR_Total + this.EyE_Ret_Total;
    this.Total_Ajuste = this.Ajuste_PapelCarton_Reciclable_Ton + this.Ajuste_Metal_Reciclable_Ton + this.Ajuste_Plastico_Reciclable_Ton + this.Ajuste_No_Reciclables_Ton + this.Ajuste_Retornables_Ton;

    this.PapelCarton_Rec_Uf = this.EyE_PapelCarton_Rec * this.rates[0].price;
    this.Metal_Rec_Uf = this.EyE_Metal_Rec * this.rates[1].price;
    this.Plastico_Rec_Uf = this.EyE_Plastico_Rec * this.rates[2].price;
    this.NR_Uf = this.EyE_NR * this.rates[3].price;
    this.Total_Uf = this.PapelCarton_Rec_Uf + this.Metal_Rec_Uf + this.Plastico_Rec_Uf + this.NR_Uf;

    this.Ajuste_PapelCarton_Reciclable_UF = (this.Ajuste_PapelCarton_Reciclable_Ton * this.rates[0].price)
    this.Ajuste_Metal_Reciclable_UF = (this.Ajuste_Metal_Reciclable_Ton * this.rates[1].price)
    this.Ajuste_Plastico_Reciclable_UF = (this.Ajuste_Plastico_Reciclable_Ton * this.rates[2].price)
    this.Ajuste_No_Reciclables_UF = (this.Ajuste_No_Reciclables_Ton * this.rates[3].price)

    this.Total_Ajuste_Uf = this.Ajuste_PapelCarton_Reciclable_UF + this.Ajuste_Metal_Reciclable_UF + this.Ajuste_Plastico_Reciclable_UF + this.Ajuste_No_Reciclables_UF
    this.PapelCarton_Rec_Uf_Corregido = this.PapelCarton_Rec_Uf + this.Ajuste_PapelCarton_Reciclable_UF;
    this.Metal_Rec_Uf_Corregido = this.Metal_Rec_Uf + this.Ajuste_Metal_Reciclable_UF;
    this.Plastico_Rec_Uf_Corregido = this.Plastico_Rec_Uf + this.Ajuste_Plastico_Reciclable_UF;
    this.NR_Uf_Corregido = this.NR_Uf + this.Ajuste_No_Reciclables_UF;

    const c1 = this.rates[0].price * (this.R_PapelCarton_P + this.R_PapelCarton_ST + this.R_PapelCarton_NP);
    const c2 = this.rates[1].price * (this.R_Metal_P + this.R_Metal_ST + this.R_Metal_NP);
    const c3 = this.rates[2].price * (this.R_Plastico_P + this.R_Plastico_ST + this.R_Plastico_NP);
    const c4 = this.rates[3].price * (this.NR_PapelCarton_P + this.NR_PapelCarton_ST + this.NR_PapelCarton_NP + this.NR_Metal_P + this.NR_Metal_ST + this.NR_Metal_NP + this.NR_Plastico_P + this.NR_Plastico_ST + this.NR_Plastico_NP + this.NR_Compuestos_P + this.NR_Compuestos_ST + this.NR_Compuestos_NP);

    this.PapelCarton_Neto= (this.PapelCarton_Rec_Uf_Corregido * this.ratesUF.data).toFixed(0);
    this.Metal_Neto= (this.Metal_Rec_Uf_Corregido * this.ratesUF.data).toFixed(0);
    this.Plastico_Neto= (this.Plastico_Rec_Uf_Corregido * this.ratesUF.data).toFixed(0);
    this.NR_Neto= (this.NR_Uf_Corregido * this.ratesUF.data).toFixed(0);
    this.PapelCarton_Bruto= (this.PapelCarton_Rec_Uf_Corregido * this.ratesUF.data * 1.19).toFixed(0);
    this.Metal_Bruto= (this.Metal_Rec_Uf_Corregido * this.ratesUF.data * 1.19).toFixed(0);
    this.Plastico_Bruto= (this.Plastico_Rec_Uf_Corregido * this.ratesUF.data * 1.19).toFixed(0);
    this.NR_Bruto= (this.NR_Uf_Corregido * this.ratesUF.data * 1.19).toFixed(0);

    this.TotalCorregido = ((c1 + parseFloat(this.Ajuste_PapelCarton_Reciclable_UF)) + (c2 + parseFloat(this.Ajuste_Metal_Reciclable_UF)) + (c3 + parseFloat(this.Ajuste_Plastico_Reciclable_UF)) + (c4 + parseFloat(this.Ajuste_No_Reciclables_UF)))
    this.TotalBruto = parseInt(this.PapelCarton_Neto) + parseInt(this.Metal_Neto) + parseInt(this.Plastico_Neto) + parseInt(this.NR_Neto);
    this.TotalBruto_IVA = parseInt(this.PapelCarton_Bruto) + parseInt(this.Metal_Bruto) + parseInt(this.Plastico_Bruto) + parseInt(this.NR_Bruto);
  }
}
