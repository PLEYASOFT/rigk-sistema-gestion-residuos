import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { concatMap } from 'rxjs';
import { ProductorService } from 'src/app/core/services/productor.service';
import * as XLSX from 'xlsx';
import { RatesTsService } from '../../../../core/services/rates.ts.service';

@Component({
  selector: 'app-summary-statement',
  templateUrl: './summary-statement.component.html',
  styleUrls: ['./summary-statement.component.css']
})

export class SummaryStatementComponent implements AfterViewInit {

  @ViewChild("table1") table!: ElementRef;

  tablas = ['Reciclable', 'No Reciclable', 'Retornables / Reutilizables'];
  residuos = [
    'Papel/Cartón Reciclable',
    'Metal Reciclable',
    'Plástico Reciclable',
    'No Reciclables',
    'Retornables'
  ];

  id_business: number = 0;
  year_statement: number = 0;
  id_statement: number | null = null;

  detailForm: any[] = [];
  detailLastForm: any[] = [];

  tonSums = {
    primario: Array.from({ length: 5 }, () => 0),
    secundario: Array.from({ length: 5 }, () => 0),
    terciario: Array.from({ length: 5 }, () => 0),
    tonSum: Array.from({ length: 5 }, () => 0),
    l_tonSum: Array.from({ length: 5 }, () => 0)
  }

  tonNoReciclablePrim = 0;
  tonNoReciclableSec = 0;
  tonNoReciclableTer = 0;
  tonRetPrim = 0;
  tonRetSec = 0;
  tonRetTer = 0;
  result: any = 0;
  dif = Array.from({ length: 5 }, () => 0);
  ajuste = Array.from({ length: 5 }, () => 0);
  costoAnual = Array.from({ length: 5 }, () => 0);
  sumaAmount = 0;
  sumaNeto = 0;
  sumaIva = 0;
  sumaUF = 0;
  hasMV_PapelCarton: any;
  hasMV_Metal: any;
  hasMV_Plastico: any;
  constructor(public productorService: ProductorService,
    private actived: ActivatedRoute,
    public ratesService: RatesTsService) {
    this.actived.queryParams.subscribe(r => {
      this.id_business = r['id_business'];
      this.year_statement = r['year'];
    });
  }
  ngAfterViewInit(): void {
    this.generateForm();
  }

  generateForm() {
    this.detailLastForm = JSON.parse(sessionStorage.getItem("detailLastForm")!);
    this.detailForm = JSON.parse(sessionStorage.getItem('detailForm')!);
    this.hasMV_PapelCarton = JSON.parse(sessionStorage.getItem("hasMV_PapelCarton")!);
    this.hasMV_Metal = JSON.parse(sessionStorage.getItem('hasMV_Metal')!);
    this.hasMV_Plastico = JSON.parse(sessionStorage.getItem('hasMV_Plastico')!);
    for (let i = 0; i < this.detailForm.length; i++) {
      const r = this.detailForm[i];
      if (r.recyclability == 3) {
        if ((r.type_residue == 1 && !this.hasMV_PapelCarton) ||
          (r.type_residue == 2 && !this.hasMV_Metal) ||
          (r.type_residue == 3 && !this.hasMV_Plastico)) {
          r.recyclability = 1;
        }
      }
      if (r.recyclability == 1) {
        if (r.precedence == 1) {
          this.tonSums.primario[r?.type_residue - 1] = this.tonSums.primario[r?.type_residue - 1] + parseFloat(r?.value);
          this.result = this.tonSums.primario[r?.type_residue - 1];

          if (r?.type_residue != 4) {
            document.getElementById(`prim_weight_${r?.type_residue}`)!.innerHTML = this.setFormato(this.result)
            this.costoAnual[r?.type_residue - 1] = this.result;
          }
        }
        if (r.precedence == 2) {
          this.tonSums.secundario[r?.type_residue - 1] = this.tonSums.secundario[r?.type_residue - 1] + parseFloat(r?.value);
          this.result = this.tonSums.secundario[r?.type_residue - 1];

          if (r?.type_residue != 4) {
            document.getElementById(`sec_weight_${r?.type_residue}`)!.innerHTML = this.setFormato(this.result)
            this.costoAnual[r?.type_residue - 1] = this.result;
          }
        }
        if (r.precedence == 3) {
          this.tonSums.terciario[r?.type_residue - 1] = this.tonSums.terciario[r?.type_residue - 1] + parseFloat(r?.value);
          this.result = this.tonSums.terciario[r?.type_residue - 1];

          if (r?.type_residue != 4) {
            document.getElementById(`ter_weight_${r?.type_residue}`)!.innerHTML = this.setFormato(this.result)
            this.costoAnual[r?.type_residue - 1] = this.result;
          }
        }
        this.costoAnual[r?.type_residue - 1] = this.tonSums.primario[r?.type_residue - 1] + this.tonSums.secundario[r?.type_residue - 1] + this.tonSums.terciario[r?.type_residue - 1];
      }
      else if (r.recyclability == 2) {
        if (r?.type_residue != 4) {
          if (r.precedence == 1) {
            this.tonNoReciclablePrim = this.tonNoReciclablePrim + parseFloat(r?.value);
            this.result = this.tonNoReciclablePrim;
            document.getElementById(`prim_weight_4`)!.innerHTML = this.setFormato(this.result)
            this.costoAnual[3] = this.result;
          }
          if (r.precedence == 2) {
            this.tonNoReciclableSec = this.tonNoReciclableSec + parseFloat(r?.value);
            this.result = this.tonNoReciclableSec;
            document.getElementById(`sec_weight_4`)!.innerHTML = this.setFormato(this.result)
            this.costoAnual[3] = this.result;
          }
          if (r.precedence == 3) {
            this.tonNoReciclableTer = this.tonNoReciclableTer + parseFloat(r?.value);
            this.result = this.tonNoReciclableTer;
            document.getElementById(`ter_weight_4`)!.innerHTML = this.setFormato(this.result)
            this.costoAnual[3] = this.result;
          }
          this.costoAnual[3] = this.tonNoReciclablePrim + this.tonNoReciclableSec + this.tonNoReciclableTer;
        }
      }

      else if (r.recyclability == 3) {
        if (r.precedence == 1) {
          this.tonRetPrim = this.tonRetPrim + parseFloat(r?.value);
          this.result = this.tonRetPrim;
          document.getElementById(`prim_weight_5`)!.innerHTML = this.setFormato(this.result);
        }
        if (r.precedence == 2) {
          this.tonRetSec = this.tonRetSec + parseFloat(r?.value);
          this.result = this.tonRetSec;
          document.getElementById(`sec_weight_5`)!.innerHTML = this.setFormato(this.result);
        }
        if (r.precedence == 3) {
          this.tonRetTer = this.tonRetTer + parseFloat(r?.value);
          this.result = this.tonRetTer;
          document.getElementById(`ter_weight_5`)!.innerHTML = this.setFormato(this.result);
        }
        this.costoAnual[4] = this.tonRetPrim + this.tonRetSec + this.tonRetTer;
      }
    }
    for (let i = 1; i <= 5; i++) {
      this.result = parseFloat(document.getElementById(`prim_weight_${i}`)!.innerHTML.replace(/\./g, "").replace(",", "."))
        + parseFloat(document.getElementById(`sec_weight_${i}`)!.innerHTML.replace(/\./g, "").replace(",", "."))
        + parseFloat(document.getElementById(`ter_weight_${i}`)!.innerHTML.replace(/\./g, "").replace(",", "."));
      document.getElementById(`total_category_weight_${i}`)!.innerHTML = this.setFormato(this.result);
      this.sumaAmount = this.sumaAmount + this.result;
    }

    document.getElementById(`total_ton`)!.innerHTML = this.setFormato(this.sumaAmount);
    document.getElementById(`pom_total`)!.innerHTML = document.getElementById(`total_ton`)!.innerHTML
    const yearRate = parseInt(this.year_statement.toString()) + 1;
    this.ratesService.getRates(yearRate).pipe(
      concatMap(clp => {
        this.sumaAmount = 0;
        // Procesamiento de los datos de la primera suscripción
        for (let i = 0; i < 4; i++) {
          document.getElementById(`actual_amount_${i}`)!.innerHTML = this.setFormato(clp.data[i].price);
          document.getElementById(`amount_anual_${i}`)!.innerHTML = this.setFormato(clp.data[i].price * this.costoAnual[i]);
          this.sumaAmount = this.sumaAmount + parseFloat((clp.data[i].price * this.costoAnual[i]).toFixed(2)) + parseFloat((clp.data[i].price * this.ajuste[i]).toFixed(2));
          this.sumaUF = this.sumaUF + parseFloat((clp.data[i].price * this.costoAnual[i]).toFixed(2))
          this.dif[i] = clp.data[i].price * this.costoAnual[i] + clp.data[i].price * this.ajuste[i];
        }
        document.getElementById(`anual_amount`)!.innerHTML = this.setFormato(this.sumaUF);
        return this.ratesService.getUF;
      }),
    )
      .subscribe(uf => {
        // Procesamiento de los datos de la segunda suscripción
        this.sumaAmount = 0;
        for (let i = 0; i < 4; i++) {
          this.sumaAmount = this.sumaAmount + (this.dif[i] * uf.data * 1.19);
          document.getElementById(`total_neto${i}`)!.innerHTML = '$' + this.setFormato((this.dif[i] * uf.data).toFixed(0));
          document.getElementById(`iva_${i}`)!.innerHTML = '$' + this.setFormato((parseInt((this.dif[i] * uf.data * 1.19).toFixed(0)) - parseInt((this.dif[i] * uf.data).toFixed(0))));
          document.getElementById(`uf_clp_${i}`)!.innerHTML = '$' + this.setFormato(parseInt((this.dif[i] * uf.data * 1.19).toFixed(0)));

          this.sumaNeto = this.sumaNeto + this.dif[i] * uf.data;
          this.sumaIva = this.sumaIva + (this.dif[i] * uf.data * 1.19 - this.dif[i] * uf.data);
        }
        document.getElementById(`total_uf_clp`)!.innerHTML = '$' + this.setFormato(parseInt(this.sumaAmount.toFixed(0)));
        document.getElementById(`amount_clp`)!.innerHTML = '$' + this.setFormato(parseInt(this.sumaAmount.toFixed(0)));
        document.getElementById(`ajuste_amount`)!.innerHTML = '$' + this.setFormato(parseInt(this.sumaNeto.toFixed(0)));
        document.getElementById(`total_amount_iva`)!.innerHTML = '$' + this.setFormato(parseInt(this.sumaIva.toFixed(0)));
      });
  }

  tableToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement, { raw: true }
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    /* save to file */
    XLSX.writeFile(wb, "Tabla-Resumen.xlsx");
  }

  setFormato(num: number | string): string {
    const numero = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    const decimal = Math.round(numero * 100) / 100;
    const [entero, decimales] = decimal.toString().split('.');
    const enteroConPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return decimales && decimales !== '0' ? `${enteroConPuntos},${decimales.padEnd(2, '0')}` : enteroConPuntos;
  }
}
