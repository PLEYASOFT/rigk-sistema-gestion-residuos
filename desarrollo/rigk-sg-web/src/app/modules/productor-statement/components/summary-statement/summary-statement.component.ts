import { CurrencyPipe } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductorService } from 'src/app/core/services/productor.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-summary-statement',
  templateUrl: './summary-statement.component.html',
  styleUrls: ['./summary-statement.component.css']
})

export class SummaryStatementComponent implements OnInit, AfterViewInit {

  @ViewChild("table1") table!: ElementRef;
  /**
   * BORRAR
   */
  tablas = ['Reciclable', 'No Reciclable', 'Retornables / Reutilizados'];
  residuos = [
    'Papel Cartón',
    'Metal',
    'Plástico',
    'Madera**',
    'Otro/Env. Compuesto'
  ];
  /**
   * END BORRAr
   */

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

  actual_weight_one = 0;
  actual_weight_two = 0;
  actual_weight_three = 0;
  last_weight_one = 0;
  last_weight_two = 0;
  last_weight_three = 0;
  actual_amount_one = 0;
  actual_amount_two = 0;
  actual_amount_three = 0;
  last_amount_one = 0;
  last_amount_two = 0;
  last_amount_three = 0;
  diff_weight_one = 0;
  diff_weight_two = 0;
  diff_weight_three = 0;
  diff_amount_one = 0;
  diff_amount_two = 0;
  diff_amount_three = 0;

  constructor(private fb: FormBuilder,
    public productorService: ProductorService,
    private router: Router,
    private actived: ActivatedRoute,
    private currencyPipe: CurrencyPipe) {
    this.actived.queryParams.subscribe(r => {
      this.id_business = r['id_business'];
      this.year_statement = r['year'];
    });
  }
  ngAfterViewInit(): void {
    
    this.generateForm();
    this.generateDiff();
  }

  ngOnInit(): void {
    
  }

  generateForm(){
    this.detailLastForm = JSON.parse(sessionStorage.getItem("detailLastForm")! ) ;
    this.detailForm = JSON.parse(sessionStorage.getItem('detailForm')! ) ;

    // Define el tamaño del arreglo
    const size = 5;

    // Crea un arreglo de ceros del tamaño especificado
    let sum1 = Array.from({length: size}, () => 0);
    let sum2 = Array.from({length: size}, () => 0);
    let sum3 = Array.from({length: size}, () => 0);
    for (let i = 0; i < this.detailForm.length; i++) {
      const r = this.detailForm[i];
      (document.getElementById(`td_${r?.recyclability}_${r?.precedence}_${r?.hazard}_${r?.type_residue}`) as HTMLElement).innerHTML = r?.value;
      const tmp_weight = (parseInt((document.getElementById(`actual_weight_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML) || 0) + parseInt(r?.value);
      const tmp_amount = (parseInt((document.getElementById(`actual_amount_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML) || 0) + parseInt(r?.amount);
      if(r.recyclability == 1)
      {
        sum1[r?.type_residue-1] = sum1[r?.type_residue-1] + tmp_amount;
        this.actual_weight_one = this.actual_weight_one +  parseInt(r?.value);
        this.actual_amount_one = this.actual_amount_one +  parseInt(r?.amount);
          
          (document.getElementById(`td_${r?.recyclability}`) as HTMLElement).innerHTML = this.actual_weight_one.toString();
          (document.getElementById(`td_amount_${r?.recyclability}`) as HTMLElement).innerHTML =  this.currencyPipe.transform(this.actual_amount_one.toString(), '', 'symbol', '1.0-0')!.toString();
          (document.getElementById(`actual_weight_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML = tmp_weight.toString();
          (document.getElementById(`actual_amount_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML = this.currencyPipe.transform(sum1[r?.type_residue-1].toString(), '', 'symbol', '1.0-0')!.toString();

      }
      else if(r.recyclability == 2)
      {
        sum2[r?.type_residue-1] = sum2[r?.type_residue-1] + tmp_amount;
        this.actual_weight_two = this.actual_weight_two +  parseInt(r?.value);
        this.actual_amount_two = this.actual_amount_two +  parseInt(r?.amount);
          (document.getElementById(`td_${r?.recyclability}`) as HTMLElement).innerHTML = this.actual_weight_two.toString();
          (document.getElementById(`td_amount_${r?.recyclability}`) as HTMLElement).innerHTML = this.currencyPipe.transform(this.actual_amount_two.toString(), '', 'symbol', '1.0-0')!.toString();
          (document.getElementById(`actual_weight_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML = tmp_weight.toString();
          (document.getElementById(`actual_amount_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML = this.currencyPipe.transform(sum2[r?.type_residue-1].toString(), '', 'symbol', '1.0-0')!.toString();
      }

      else if(r.recyclability == 3)
      {
        sum3[r?.type_residue-1] = sum3[r?.type_residue-1] + tmp_amount;
        this.actual_weight_three = this.actual_weight_three +  parseInt(r?.value);
        this.actual_amount_three = this.actual_amount_three +  parseInt(r?.amount);
          (document.getElementById(`td_${r?.recyclability}`) as HTMLElement).innerHTML = this.actual_weight_three.toString();
          (document.getElementById(`td_amount_${r?.recyclability}`) as HTMLElement).innerHTML = this.currencyPipe.transform(this.actual_amount_three.toString(), '', 'symbol', '1.0-0')!.toString();
          (document.getElementById(`actual_weight_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML = tmp_weight.toString();
          (document.getElementById(`actual_amount_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML = this.currencyPipe.transform(sum3[r?.type_residue-1].toString(), '', 'symbol', '1.0-0')!.toString();

      }
    }
    sum1 = Array.from({length: size}, () => 0);
    sum2 = Array.from({length: size}, () => 0);
    sum3 = Array.from({length: size}, () => 0);
    for (let i = 0; i < this.detailLastForm.length; i++) {
      const r = this.detailLastForm[i];
      (document.getElementById(`td_l_${r?.RECYCLABILITY}_${r?.PRECEDENCE}_${r?.HAZARD}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML = r?.VALUE;
      const tmp_weight = (parseInt((document.getElementById(`l_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML) || 0) + parseInt(r?.VALUE);
      const tmp_amount = (parseInt((document.getElementById(`l_amount_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML) || 0) + parseInt(r?.AMOUNT);
      if(r.RECYCLABILITY == 1)
      {
        sum1[r?.TYPE_RESIDUE-1] = sum1[r?.TYPE_RESIDUE-1] + tmp_amount;
        this.last_weight_one = this.last_weight_one +  parseInt(r?.VALUE);
        this.last_amount_one = this.last_amount_one +  parseInt(r?.AMOUNT);
          (document.getElementById(`td_l_${r?.RECYCLABILITY}`) as HTMLElement).innerHTML = this.last_weight_one.toString();
          (document.getElementById(`td_l_amount_${r?.RECYCLABILITY}`) as HTMLElement).innerHTML = this.currencyPipe.transform(this.last_amount_one.toString(), '', 'symbol', '1.0-0')!.toString();
          (document.getElementById(`l_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML = tmp_weight.toString();
          (document.getElementById(`l_amount_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML = this.currencyPipe.transform(sum1[r?.TYPE_RESIDUE-1].toString(), '', 'symbol', '1.0-0')!.toString();
      }

      else if(r.RECYCLABILITY == 2)
      {
        sum2[r?.TYPE_RESIDUE-1] = sum2[r?.TYPE_RESIDUE-1] + tmp_amount;
        this.last_weight_two = this.last_weight_two +  parseInt(r?.VALUE);
        this.last_amount_two = this.last_amount_two +  parseInt(r?.AMOUNT);
          (document.getElementById(`td_l_${r?.RECYCLABILITY}`) as HTMLElement).innerHTML = this.last_weight_two.toString();
          (document.getElementById(`td_l_amount_${r?.RECYCLABILITY}`) as HTMLElement).innerHTML = this.currencyPipe.transform(this.last_amount_two.toString(), '', 'symbol', '1.0-0')!.toString();
          (document.getElementById(`l_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML = tmp_weight.toString();
          (document.getElementById(`l_amount_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML = this.currencyPipe.transform(sum2[r?.TYPE_RESIDUE-1].toString(), '', 'symbol', '1.0-0')!.toString();
      }

      else if(r.RECYCLABILITY == 3)
      {
        sum3[r?.TYPE_RESIDUE-1] = sum3[r?.TYPE_RESIDUE-1] + tmp_amount;
        this.last_weight_three = this.last_weight_three +  parseInt(r?.VALUE);
        this.last_amount_three = this.last_amount_three +  parseInt(r?.AMOUNT);
          (document.getElementById(`td_l_${r?.RECYCLABILITY}`) as HTMLElement).innerHTML = this.last_weight_three.toString();
          (document.getElementById(`td_l_amount_${r?.RECYCLABILITY}`) as HTMLElement).innerHTML = this.currencyPipe.transform(this.last_amount_three.toString(), '', 'symbol', '1.0-0')!.toString();
          (document.getElementById(`l_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML = tmp_weight.toString();
          (document.getElementById(`l_amount_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML = this.currencyPipe.transform(sum3[r?.TYPE_RESIDUE-1].toString(), '', 'symbol', '1.0-0')!.toString();
      }
    }
  }

  generateDiff()
  {
    this.last_weight_one != 0 ? this.diff_weight_one = parseInt(((( this.actual_weight_one - this.last_weight_one) / this.last_weight_one) * 100).toFixed(2)) :
                                this.diff_weight_one = 0;
    this.last_weight_two != 0 ? this.diff_weight_two = parseInt(((( this.actual_weight_two - this.last_weight_two) / this.last_weight_two) * 100).toFixed(2)) :
                                this.diff_weight_two = 0;
    this.last_weight_three != 0 ? this.diff_weight_three = parseInt(((( this.actual_weight_three - this.last_weight_three) / this.last_weight_three) * 100).toFixed(2)) :
                                this.diff_weight_three = 0;
    this.last_amount_one != 0 ? this.diff_amount_one = parseInt(((( this.actual_amount_one - this.last_amount_one) / this.last_amount_one) * 100).toFixed(2)) :
                                this.diff_amount_one = 0;
    this.last_amount_two != 0 ? this.diff_amount_two = parseInt(((( this.actual_amount_two - this.last_amount_two) / this.last_amount_two) * 100).toFixed(2)) :
                                this.diff_amount_two = 0;
    this.last_amount_three != 0 ? this.diff_amount_three = parseInt(((( this.actual_amount_three - this.last_amount_three) / this.last_amount_three) * 100).toFixed(2)) :
                                this.diff_amount_three = 0;

    for (let i = 1; i <= 3; i++) {
      for(let j = 1; j <= 5; j++){
      const tmp_weight = (parseInt((document.getElementById(`actual_weight_${i}_${j}`) as HTMLElement).innerHTML) || 0);
      const tmp_l_weight = (parseInt((document.getElementById(`l_weight_${i}_${j}`) as HTMLElement).innerHTML) || 0);
      const tmp_amount = parseInt((document.getElementById(`actual_amount_${i}_${j}`) as HTMLElement).innerHTML.replace(/[$.]/g,'')) ;
      const tmp_l_amount = parseInt((document.getElementById(`l_amount_${i}_${j}`) as HTMLElement).innerHTML.replace(/[$.]/g,'')) ;
      if(tmp_l_weight != 0){
        (document.getElementById(`diff_weight_${i}_${j}`) as HTMLElement).innerHTML = ((( tmp_weight - tmp_l_weight) / tmp_l_weight) * 100).toFixed(2)+'%';
      }
      else if (tmp_weight != 0){
        (document.getElementById(`diff_weight_${i}_${j}`) as HTMLElement).innerHTML ='100%';
      }
      else{
        (document.getElementById(`diff_weight_${i}_${j}`) as HTMLElement).innerHTML ='0%';
      }

      if(tmp_l_amount != 0){
        (document.getElementById(`diff_amount_${i}_${j}`) as HTMLElement).innerHTML = ((( tmp_amount - tmp_l_amount) / tmp_l_amount) * 100).toFixed(2)+'%';
      }
      else if (tmp_amount != 0){
        (document.getElementById(`diff_amount_${i}_${j}`) as HTMLElement).innerHTML ='100%';
      }
      else{
        (document.getElementById(`diff_amount_${i}_${j}`) as HTMLElement).innerHTML ='0%';
      }
      }
    }
    (document.getElementById(`td_diff_weight_1`) as HTMLElement).innerHTML = this.diff_weight_one.toString()+'%';
    (document.getElementById(`td_diff_weight_2`) as HTMLElement).innerHTML = this.diff_weight_two.toString()+'%';
    (document.getElementById(`td_diff_weight_3`) as HTMLElement).innerHTML = this.diff_weight_three.toString()+'%';
    (document.getElementById(`td_diff_amount_1`) as HTMLElement).innerHTML = this.diff_amount_one.toString()+'%';
    (document.getElementById(`td_diff_amount_2`) as HTMLElement).innerHTML = this.diff_amount_two.toString()+'%';
    (document.getElementById(`td_diff_amount_3`) as HTMLElement).innerHTML = this.diff_amount_three.toString()+'%';
  }

  tableToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement, {raw: true}
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    /* save to file */
    XLSX.writeFile(wb, "Tabla-Resumen.xlsx");
  }
}
