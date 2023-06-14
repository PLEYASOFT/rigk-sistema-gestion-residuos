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

export class SummaryStatementComponent implements OnInit, AfterViewInit {

  @ViewChild("table1") table!: ElementRef;

  tablas = ['Reciclable', 'No Reciclable', 'Retornables / Reutilizables'];
  residuos = [
    'Papel/Cartón Reciclable',
    'Metal Reciclable',
    'Plástico Reciclable',
    'No Reciclables',
    'Retornables'
  ];

  isSubmited = false;
  isEdited = false;
  id_business: number = 0;
  year_statement: number = 0;
  id_statement: number | null = null;

  detail = this.fb.group({
    precedence: [],
    hazard: [],
    recyclability: [1],
    type_residue: [1],
    value: [],
    amount: []
  });

  detailForm: any[] = [];
  headLastForm: any = {};
  detailLastForm: any[] = [];

  tonSums = {
    primario: Array.from({ length: 5 }, () => 0),
    secundario: Array.from({ length: 5 }, () => 0),
    terciario: Array.from({ length: 5 }, () => 0),
    tonSum: Array.from({ length: 5 }, () => 0),
    l_tonSum: Array.from({ length: 5 }, () => 0)
  }

  tonNoReciclable = 0;
  tonNoReciclablePrim = 0;
  tonNoReciclableSec = 0;
  tonNoReciclableTer = 0;
  tonRetPrim = 0;
  tonRetSec = 0;
  tonRetTer = 0;
  tonRetornable = 0;
  l_tonNoReciclable = 0;
  l_tonRetornable = 0;
  result: any = 0;
  dif = Array.from({ length: 5 }, () => 0);
  ajuste = Array.from({ length: 5 }, () => 0);
  costoAnual = Array.from({ length: 5 }, () => 0);
  sumaAmount = 0;
  sumaAjuste = 0;
  amountAnual = 0;

  constructor(private fb: FormBuilder,
    public productorService: ProductorService,
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

  ngOnInit(): void {
  }

  generateForm() {
    this.detailLastForm = JSON.parse(sessionStorage.getItem("detailLastForm")!);
    this.detailForm = JSON.parse(sessionStorage.getItem('detailForm')!);
    for (let i = 0; i < this.detailForm.length; i++) {
      const r = this.detailForm[i];
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

      }
      else if (r.recyclability == 2) {
        if (r?.type_residue != 4) {
          if (r.precedence == 1) {
            console.log(r)
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
        }
      }

      else if (r.recyclability == 3) {
        if (r.precedence == 1) {
          this.tonRetPrim = this.tonRetPrim + parseFloat(r?.value);
          this.result = this.tonRetPrim;
          document.getElementById(`prim_weight_5`)!.innerHTML = this.setFormato(this.result);
          this.costoAnual[4] = this.result;
        }
        if (r.precedence == 2) {
          this.tonRetSec = this.tonRetSec + parseFloat(r?.value);
          this.result = this.tonRetSec;
          document.getElementById(`sec_weight_5`)!.innerHTML = this.setFormato(this.result);
          this.costoAnual[4] = this.result;
        }
        if (r.precedence == 3) {
          this.tonRetTer = this.tonRetTer + parseFloat(r?.value);
          this.result = this.tonRetTer;
          document.getElementById(`ter_weight_5`)!.innerHTML = this.setFormato(this.result);
          this.costoAnual[4] = this.result;
        }
      }
    }
    for (let i = 1; i <= 5; i++) {
      this.result = parseFloat(document.getElementById(`prim_weight_${i}`)!.innerHTML.replace(",", ".")) + parseFloat(document.getElementById(`sec_weight_${i}`)!.innerHTML.replace(",", ".")) + parseFloat(document.getElementById(`ter_weight_${i}`)!.innerHTML.replace(",", "."));
      console.log(document.getElementById(`sec_weight_${i}`)!.innerHTML)
      console.log(this.result)
      document.getElementById(`total_category_weight_${i}`)!.innerHTML = this.setFormato(this.result);
      this.sumaAmount = this.sumaAmount + this.result;
    }

    document.getElementById(`total_ton`)!.innerHTML = this.setFormato(this.sumaAmount);
    document.getElementById(`pom_total`)!.innerHTML = document.getElementById(`total_ton`)!.innerHTML

    this.ratesService.getCLP.pipe(
      concatMap(clp => {
        this.sumaAmount = 0;
        // Procesamiento de los datos de la primera suscripción
        for (let i = 0; i < 4; i++) {
          document.getElementById(`actual_amount_${i}`)!.innerHTML = this.setFormato(clp.data[i].price);
          document.getElementById(`amount_anual_${i}`)!.innerHTML = this.setFormato(clp.data[i].price * this.costoAnual[i]);
          document.getElementById(`amount_corregido_${i}`)!.innerHTML = this.setFormato(clp.data[i].price * this.ajuste[i]);
          document.getElementById(`total_category_amount_${i}`)!.innerHTML = this.setFormato((clp.data[i].price * this.costoAnual[i]) + (clp.data[i].price * this.ajuste[i]));
          this.sumaAmount = this.sumaAmount + parseFloat((clp.data[i].price * this.costoAnual[i]).toFixed(2)) + parseFloat((clp.data[i].price * this.ajuste[i]).toFixed(2));
          this.dif[i] = clp.data[i].price * this.costoAnual[i] + clp.data[i].price * this.ajuste[i];
          this.sumaAjuste = this.sumaAjuste + parseFloat((clp.data[i].price * this.ajuste[i]).toFixed(2));
          this.amountAnual = this.amountAnual + parseFloat((clp.data[i].price * this.costoAnual[i]).toFixed(2));
        }
        // Se regresa un observable para la segunda suscripción
        document.getElementById(`anual_amount`)!.innerHTML = this.setFormato(this.amountAnual);
        document.getElementById(`ajuste_amount`)!.innerHTML = this.setFormato(this.sumaAjuste);
        document.getElementById(`total_amount`)!.innerHTML = this.setFormato(this.sumaAmount);
        document.getElementById(`amount_total`)!.innerHTML = document.getElementById(`total_amount`)!.innerHTML
        return this.ratesService.getUF;
      }),
    )
      .subscribe(uf => {
        // Procesamiento de los datos de la segunda suscripción
        this.sumaAmount = 0;
        for (let i = 0; i < 4; i++) {
          this.sumaAmount = this.sumaAmount + parseInt((this.dif[i] * uf.data * 1.19).toFixed(0));
          document.getElementById(`uf_clp_${i}`)!.innerHTML = '$' + this.setFormato(parseInt((this.dif[i] * uf.data * 1.19).toFixed(0)));
        }
        document.getElementById(`total_uf_clp`)!.innerHTML = '$' + this.setFormato(this.sumaAmount);
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

  verifyNumber(number: number) {
    if (Number.isInteger(number)) {
      return number.toString();
    } else {
      return number.toFixed(2);
    }
  }

  setFormato(num: number | string): string {
    const numero = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
    const decimal = Math.round(numero * 100) / 100;
    const [entero, decimales] = decimal.toString().split('.');
    const enteroConPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return decimales && decimales !== '0' ? `${enteroConPuntos},${decimales.padEnd(2, '0')}` : enteroConPuntos;
  }
}
