import { CurrencyPipe } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  /**
   * BORRAR
   */
  tablas = ['Reciclable', 'No Reciclable', 'Retornables / Reutilizados'];
  residuos = [
    'Papel Cartón',
    'Metal',
    'Plástico',
    'Madera',
    'Envases compuestos'
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

  actual_weight = 0;
  last_weight = 0;
  actual_amount = 0;
  last_amount = 0;
  total_diff_corregido = 0;
  uf = 0;

  tonSums = {
    tonSum1  : Array.from({length: 5}, () => 0),
    tonSum2  : Array.from({length: 5}, () => 0),
    tonSum3  : Array.from({length: 5}, () => 0),
    l_tonSum1: Array.from({length: 5}, () => 0),
    l_tonSum2: Array.from({length: 5}, () => 0),
    l_tonSum3: Array.from({length: 5}, () => 0)
  }

  costoSums = {
    costoSum1   : Array.from({length: 5}, () => 0),
    costoSum2   : Array.from({length: 5}, () => 0),
    costoSum3   : Array.from({length: 5}, () => 0),
    l_costoSum1 : Array.from({length: 5}, () => 0),
    l_costoSum2 : Array.from({length: 5}, () => 0),
    l_costoSum3 : Array.from({length: 5}, () => 0)
  }
  


  constructor(private fb: FormBuilder,
    public productorService: ProductorService,
    private router: Router,
    private actived: ActivatedRoute,
    public ratesService: RatesTsService) {
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
    let result: string;
    let resultAmount: string;
    for (let i = 0; i < this.detailForm.length; i++) {
      const r = this.detailForm[i];
      if(r.recyclability == 1)
      {
        this.tonSums.tonSum1[r?.type_residue-1] = this.tonSums.tonSum1[r?.type_residue-1] + parseFloat(r?.value);
        this.costoSums.costoSum1[r?.type_residue-1] = this.costoSums.costoSum1[r?.type_residue-1] + parseFloat(r?.amount);
        this.actual_weight = this.actual_weight +  parseFloat(r?.value);
        this.actual_amount = this.actual_amount +  parseFloat(r?.amount);

        
        if (Number.isInteger(this.tonSums.tonSum1[r?.type_residue-1])) {
          result = this.tonSums.tonSum1[r?.type_residue-1].toString();  
        } else {
          result = this.tonSums.tonSum1[r?.type_residue-1].toFixed(2);  
        }

        if (Number.isInteger(this.costoSums.costoSum1[r?.type_residue-1])) {
          resultAmount = this.costoSums.costoSum1[r?.type_residue-1].toString();  
        } else {
          resultAmount = this.costoSums.costoSum1[r?.type_residue-1].toFixed(2);  
        }

          (document.getElementById(`actual_weight_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML = result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          (document.getElementById(`actual_amount_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML = resultAmount.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      }
      else if(r.recyclability == 2)
      {
        this.tonSums.tonSum2[r?.type_residue-1] = this.tonSums.tonSum2[r?.type_residue-1] + parseFloat(r?.value);
        this.costoSums.costoSum2[r?.type_residue-1] = this.costoSums.costoSum2[r?.type_residue-1] + parseFloat(r?.amount);
        this.actual_weight = this.actual_weight +  parseFloat(r?.value);
        this.actual_amount = this.actual_amount +  parseFloat(r?.amount);

        if (Number.isInteger(this.tonSums.tonSum2[r?.type_residue-1])) {
          result = this.tonSums.tonSum2[r?.type_residue-1].toString();  
        } else {
          result = this.tonSums.tonSum2[r?.type_residue-1].toFixed(2);  
        }

        if (Number.isInteger(this.costoSums.costoSum2[r?.type_residue-1])) {
          resultAmount = this.costoSums.costoSum2[r?.type_residue-1].toString();  
        } else {
          resultAmount = this.costoSums.costoSum2[r?.type_residue-1].toFixed(2);  
        }
          (document.getElementById(`actual_weight_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML = result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          (document.getElementById(`actual_amount_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML = resultAmount.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }

      else if(r.recyclability == 3)
      {
        this.tonSums.tonSum3[r?.type_residue-1] = this.tonSums.tonSum3[r?.type_residue-1] + parseFloat(r?.value);
        this.costoSums.costoSum3[r?.type_residue-1] = this.costoSums.costoSum3[r?.type_residue-1] + parseFloat(r?.amount);
        this.actual_weight = this.actual_weight +  parseFloat(r?.value);
        this.actual_amount = this.actual_amount +  parseFloat(r?.amount);
        if (Number.isInteger(this.tonSums.tonSum3[r?.type_residue-1])) {
          result = this.tonSums.tonSum3[r?.type_residue-1].toString();  
        } else {
          result = this.tonSums.tonSum3[r?.type_residue-1].toFixed(2);  
        }

        if (Number.isInteger(this.costoSums.costoSum3[r?.type_residue-1])) {
          resultAmount = this.costoSums.costoSum3[r?.type_residue-1].toString();  
        } else {
          resultAmount = this.costoSums.costoSum3[r?.type_residue-1].toFixed(2);  
        }
          (document.getElementById(`actual_weight_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML = result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          (document.getElementById(`actual_amount_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML = resultAmount.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      }
    }

    for(let i = 0; i<5;i++){
      if (Number.isInteger((this.tonSums.tonSum1[i] +this.tonSums.tonSum2[i]+this.tonSums.tonSum3[i]))) {
        result = (this.tonSums.tonSum1[i] +this.tonSums.tonSum2[i]+this.tonSums.tonSum3[i]).toString();  
      } else {
        result = (this.tonSums.tonSum1[i] +this.tonSums.tonSum2[i]+this.tonSums.tonSum3[i]).toFixed(2);  
      }

      if (Number.isInteger((this.costoSums.costoSum1[i] +this.costoSums.costoSum2[i]+this.costoSums.costoSum3[i]))) {
        resultAmount = (this.costoSums.costoSum1[i] +this.costoSums.costoSum2[i]+this.costoSums.costoSum3[i]).toString();  
      } else {
        resultAmount = (this.costoSums.costoSum1[i] +this.costoSums.costoSum2[i]+this.costoSums.costoSum3[i]).toFixed(2);  
      }

      (document.getElementById(`total_category_weight_${i}`) as HTMLElement).innerHTML = result;
      
      (document.getElementById(`total_category_amount_${i}`) as HTMLElement).innerHTML = resultAmount;
    }

    if (Number.isInteger(this.actual_weight)) {
      result = this.actual_weight.toString();  
    } else {
      result = this.actual_weight.toFixed(2);  
    }

    if (Number.isInteger(this.actual_amount)) {
      resultAmount = this.actual_amount.toString();  
    } else {
      resultAmount = this.actual_amount.toFixed(2);  
    }
    (document.getElementById(`total_ton`) as HTMLElement).innerHTML = result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, "."); 
    (document.getElementById(`total_amount`) as HTMLElement).innerHTML = resultAmount.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    for (let i = 0; i < this.detailLastForm.length; i++) {
      const r = this.detailLastForm[i];
      if(r.RECYCLABILITY == 1)
      {
        this.tonSums.l_tonSum1[r?.TYPE_RESIDUE-1] = this.tonSums.l_tonSum1[r?.TYPE_RESIDUE-1] + parseFloat(r?.VALUE);
        this.costoSums.l_costoSum1[r?.TYPE_RESIDUE-1] = this.costoSums.l_costoSum1[r?.TYPE_RESIDUE-1] + parseFloat(r?.VALUE);
        this.last_weight = this.last_weight +  parseFloat(r?.VALUE);
        this.last_amount = this.last_amount +  parseFloat(r?.AMOUNT);
      }

      else if(r.RECYCLABILITY == 2)
      {
        this.tonSums.l_tonSum2[r?.TYPE_RESIDUE-1] = this.tonSums.l_tonSum2[r?.TYPE_RESIDUE-1] + parseFloat(r?.VALUE);
        this.last_weight = this.last_weight +  parseFloat(r?.VALUE);
        this.last_amount = this.last_amount +  parseFloat(r?.AMOUNT);
      }

      else if(r.RECYCLABILITY == 3)
      {
        this.tonSums.l_tonSum3[r?.TYPE_RESIDUE-1] = this.tonSums.l_tonSum3[r?.TYPE_RESIDUE-1] + parseFloat(r?.VALUE);
        this.last_weight = this.last_weight +  parseFloat(r?.VALUE);
        this.last_amount = this.last_amount +  parseFloat(r?.AMOUNT);
      }
    }
  }

  generateDiff()
  {
    let dif = Array.from({length: 5}, () => 0);
    //Diferencias por tipo de residuo
    for(let i = 0; i<5;i++){
      if((this.tonSums.l_tonSum1[i] +this.tonSums.l_tonSum2[i]+this.tonSums.l_tonSum3[i]) != 0 && (this.tonSums.tonSum1[i] +this.tonSums.tonSum2[i]+this.tonSums.tonSum3[i]) != 0 ){
        (document.getElementById(`diff_category_${i}`) as HTMLElement).innerHTML = ((((this.tonSums.tonSum1[i] +this.tonSums.tonSum2[i]+this.tonSums.tonSum3[i]) - (this.tonSums.tonSum1[i] +this.tonSums.l_tonSum2[i]+
                                                                                    this.tonSums.l_tonSum3[i])) / (this.tonSums.l_tonSum1[i] +this.tonSums.l_tonSum2[i]+this.tonSums.l_tonSum3[i]) * 100).toFixed(2)) + '%';
        dif[i] = ((this.tonSums.tonSum1[i] +this.tonSums.tonSum2[i]+this.tonSums.tonSum3[i]) - (this.tonSums.l_tonSum1[i] +this.tonSums.l_tonSum2[i]+
          this.tonSums.l_tonSum3[i])) / (this.tonSums.l_tonSum1[i] +this.tonSums.l_tonSum2[i]+this.tonSums.l_tonSum3[i]);
      }
      else{
        (document.getElementById(`diff_category_${i}`) as HTMLElement).innerHTML = '0%'
      }
    }

    //Diferencia peso total año anterior y actual
    
    if(this.actual_weight != 0 &&this.last_weight != 0 ){
      (document.getElementById(`diff_ton`) as HTMLElement).innerHTML = ((((this.actual_weight - this.last_weight)/ this.last_weight)*100).toFixed(2)) + '%';
    }
    else{
      (document.getElementById(`diff_ton`) as HTMLElement).innerHTML = '0%'
    }

    //Valor corregido Peso
    let dif_aux = 0;
    for(let i = 0; i<5;i++){
      dif_aux = parseFloat((document.getElementById(`total_category_weight_${i}`) as HTMLElement).innerHTML) + (parseFloat((document.getElementById(`total_category_weight_${i}`) as HTMLElement).innerHTML) * (dif[i]));
      (document.getElementById(`diff_corregido_weight_${i}`) as HTMLElement).innerHTML = ((dif_aux).toFixed(2)).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      this.total_diff_corregido= this.total_diff_corregido + dif_aux;
      (document.getElementById(`total_diff_corregido_weight`) as HTMLElement).innerHTML = this.total_diff_corregido.toFixed(2).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      (document.getElementById(`pom_total`) as HTMLElement).innerHTML = this.total_diff_corregido.toFixed(2).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    

    //Valor corregido UF
    this.total_diff_corregido = 0;
    for(let i = 0; i<5;i++){
      (document.getElementById(`diff_corregido_amount_${i}`) as HTMLElement).innerHTML = ((parseFloat((document.getElementById(`total_category_amount_${i}`) as HTMLElement).innerHTML) + 
                                                                                        (parseFloat((document.getElementById(`total_category_amount_${i}`) as HTMLElement).innerHTML) *
                                                                                        (dif[i]))).toFixed(2)).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      this.total_diff_corregido= this.total_diff_corregido + parseFloat((document.getElementById(`diff_corregido_amount_${i}`) as HTMLElement).innerHTML.replace(/[,]/g,'.').replace(/\B(?=(\d{3})+(?!\d))/g, ""));
      (document.getElementById(`total_diff_corregido_amount`) as HTMLElement).innerHTML = this.total_diff_corregido.toFixed(2).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      (document.getElementById(`amount_total`) as HTMLElement).innerHTML = this.total_diff_corregido.toFixed(2).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    //Valor corregido UF a CLP
    this.total_diff_corregido = 0;
    this.ratesService.getUF.subscribe(uf => {

      for(let i = 0; i<5;i++){
        let uf_corregido = parseFloat((document.getElementById(`diff_corregido_amount_${i}`) as HTMLElement).innerHTML.replace(/[,]/g,'.'));
        (document.getElementById(`uf_clp_${i}`) as HTMLElement).innerHTML = '$'+(uf_corregido * uf.data * 1.19).toFixed(0).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        this.total_diff_corregido= this.total_diff_corregido + parseFloat((uf_corregido * uf.data * 1.19).toFixed(0));
        (document.getElementById(`total_uf_clp`) as HTMLElement).innerHTML = '$'+this.total_diff_corregido.toFixed(0).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }

      sessionStorage.setItem('totalCLP','$'+this.total_diff_corregido.toFixed(0).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, "."));
      sessionStorage.setItem('porcentajeDiff',(document.getElementById(`diff_ton`) as HTMLElement).innerHTML);
    });
    
    //Corrección datos

    for(let i = 0; i<5;i++){

      (document.getElementById(`total_category_weight_${i}`) as HTMLElement).innerHTML = (document.getElementById(`total_category_weight_${i}`) as HTMLElement).innerHTML.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      
      (document.getElementById(`total_category_amount_${i}`) as HTMLElement).innerHTML = (document.getElementById(`total_category_amount_${i}`) as HTMLElement).innerHTML.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
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
