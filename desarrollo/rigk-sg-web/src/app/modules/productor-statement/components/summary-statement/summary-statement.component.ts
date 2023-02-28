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
    tonSum  : Array.from({length: 5}, () => 0),
    l_tonSum: Array.from({length: 5}, () => 0)
  }

  tonNoReciclable = 0;
  tonRetornable = 0;
  l_tonNoReciclable = 0;
  l_tonRetornable = 0;
  result: string = "";
  dif = Array.from({length: 5}, () => 0);
  ajuste = Array.from({length: 5}, () => 0);
  costoAnual = Array.from({length: 5}, () => 0);
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

  generateForm(){
    this.detailLastForm = JSON.parse(sessionStorage.getItem("detailLastForm")! ) ;
    this.detailForm = JSON.parse(sessionStorage.getItem('detailForm')! ) ;
    for (let i = 0; i < this.detailForm.length; i++) {
      const r = this.detailForm[i];
      if(r.recyclability == 1)
      {
        this.tonSums.tonSum[r?.type_residue-1] = this.tonSums.tonSum[r?.type_residue-1] + parseFloat(r?.value);
        this.result = this.verifyNumber(this.tonSums.tonSum[r?.type_residue-1]);

        if(r?.type_residue!=4){
          document.getElementById(`actual_weight_${r?.type_residue}`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          this.costoAnual[r?.type_residue-1] = parseFloat(this.result);
          }
      }
      else if(r.recyclability == 2)
      {
        if(r?.type_residue != 4){
          this.tonNoReciclable = this.tonNoReciclable + parseFloat(r?.value);
          this.result = this.verifyNumber(this.tonNoReciclable);
          document.getElementById(`actual_weight_4`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          this.costoAnual[3] = parseFloat(this.result);
        }
        }

      else if(r.recyclability == 3)
      {
          this.tonRetornable = this.tonRetornable + parseFloat(r?.value);
          this.result = this.verifyNumber(this.tonRetornable);
          document.getElementById(`actual_weight_5`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          this.costoAnual[4] = parseFloat(this.result);
        }
    }

    for (let i = 0; i < this.detailLastForm.length; i++) {
      const r = this.detailLastForm[i];
      if(r.RECYCLABILITY == 1)
      {
        this.tonSums.l_tonSum[r?.TYPE_RESIDUE-1] = this.tonSums.l_tonSum[r?.TYPE_RESIDUE-1] + parseFloat(r?.VALUE);
        this.result = this.verifyNumber(this.tonSums.l_tonSum[r?.TYPE_RESIDUE-1]);

        if(r?.TYPE_RESIDUE != 4){
          document.getElementById(`last_weight_${r?.TYPE_RESIDUE}`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          }
      }

      else if(r.RECYCLABILITY == 2)
      {

        if(r?.TYPE_RESIDUE != 4){
          this.l_tonNoReciclable = this.l_tonNoReciclable + parseFloat(r?.VALUE);
          this.result = this.verifyNumber(this.l_tonNoReciclable);
          document.getElementById(`last_weight_4`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
      }

      else if(r.RECYCLABILITY == 3)
      {
        this.l_tonRetornable = this.l_tonRetornable + parseFloat(r?.VALUE);
        this.result = this.verifyNumber(this.l_tonRetornable);

        document.getElementById(`last_weight_5`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    }
    for(let i = 1; i<= 5; i++){
      if(i <= 3){
        this.result =  this.verifyNumber(this.tonSums.tonSum[i-1] -  this.tonSums.l_tonSum[i-1]);
        document.getElementById(`ajuste_${i}`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        this.ajuste[i-1] = parseFloat(this.result);
        
        if(this.tonSums.l_tonSum[i-1] == 0){
          document.getElementById(`total_category_weight_${i}`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          document.getElementById(`ajuste_${i}`)!.innerHTML = '0';
          this.ajuste[i-1] = 0;
          this.sumaAmount = this.sumaAmount + parseFloat(this.result);
        }
        else{
          this.result = this.verifyNumber(this.tonSums.tonSum[i-1] + (this.tonSums.tonSum[i-1] -  this.tonSums.l_tonSum[i-1]));
          document.getElementById(`total_category_weight_${i}`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          this.sumaAmount = this.sumaAmount + parseFloat(this.result);
        }
      }
      else if( i == 4){
        this.result =  this.verifyNumber(this.tonNoReciclable -  this.l_tonNoReciclable);
        document.getElementById(`ajuste_${i}`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        this.ajuste[i-1] = parseFloat(this.result);

        if(this.l_tonNoReciclable == 0){
          document.getElementById(`total_category_weight_${i}`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          document.getElementById(`ajuste_${i}`)!.innerHTML = '0';
          this.ajuste[i-1] = 0;
          this.sumaAmount = this.sumaAmount + parseFloat(this.result);
        }
        else{
          this.result = this.verifyNumber(this.tonNoReciclable + (this.tonNoReciclable -  this.l_tonNoReciclable));
          document.getElementById(`total_category_weight_${i}`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          this.sumaAmount = this.sumaAmount + parseFloat(this.result);
        }
        
      }
      else{
        this.result =  this.verifyNumber(this.tonRetornable -  this.l_tonRetornable);
        document.getElementById(`ajuste_${i}`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        this.ajuste[i-1] = parseFloat(this.result);

        if(this.l_tonRetornable == 0){
          document.getElementById(`total_category_weight_${i}`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          document.getElementById(`ajuste_${i}`)!.innerHTML = '0';
          this.ajuste[i-1] = 0;
          this.sumaAmount = this.sumaAmount + parseFloat(this.result);
        }
        else{
          this.result = this.verifyNumber(this.tonRetornable + (this.tonRetornable -  this.l_tonRetornable));
          document.getElementById(`total_category_weight_${i}`)!.innerHTML = this.result.replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          this.sumaAmount = this.sumaAmount + parseFloat(this.result);
        }
      }
    }

    document.getElementById(`total_ton`)!.innerHTML = this.verifyNumber(this.sumaAmount).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    document.getElementById(`pom_total`)!.innerHTML = document.getElementById(`total_ton`)!.innerHTML 

    this.ratesService.getCLP.pipe(
      concatMap(clp => {
        this.sumaAmount = 0;
        // Procesamiento de los datos de la primera suscripción
        for(let i = 0; i< 4; i++){
          document.getElementById(`actual_amount_${i}`)!.innerHTML = clp.data[i].price.toString();
          document.getElementById(`amount_anual_${i}`)!.innerHTML = (clp.data[i].price * this.costoAnual[i]).toFixed(2).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          document.getElementById(`amount_corregido_${i}`)!.innerHTML = (clp.data[i].price * this.ajuste[i]).toFixed(2).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          document.getElementById(`total_category_amount_${i}`)!.innerHTML = ( parseFloat((clp.data[i].price * this.costoAnual[i]).toFixed(2)) + parseFloat((clp.data[i].price * this.ajuste[i]).toFixed(2)) ).toFixed(2).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          this.sumaAmount = this.sumaAmount + parseFloat((clp.data[i].price * this.costoAnual[i]).toFixed(2)) + parseFloat((clp.data[i].price * this.ajuste[i]).toFixed(2));
          this.dif[i] = clp.data[i].price * this.costoAnual[i] + clp.data[i].price * this.ajuste[i];
          this.sumaAjuste = this.sumaAjuste + clp.data[i].price * this.ajuste[i];
          this.amountAnual = this.amountAnual + clp.data[i].price * this.costoAnual[i];
        }
        // Se regresa un observable para la segunda suscripción
        document.getElementById(`anual_amount`)!.innerHTML = this.amountAnual.toFixed(2).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        document.getElementById(`ajuste_amount`)!.innerHTML = this.sumaAjuste.toFixed(2).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        document.getElementById(`total_amount`)!.innerHTML = this.sumaAmount.toFixed(2).replace(/[.]/g,',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        document.getElementById(`amount_total`)!.innerHTML = document.getElementById(`total_amount`)!.innerHTML 
        return this.ratesService.getUF;
      }),
    )
    .subscribe(uf => {
      // Procesamiento de los datos de la segunda suscripción
      this.sumaAmount = 0;
      for(let i = 0; i< 4; i++){
        this.sumaAmount = parseInt((this.sumaAmount + this.dif[i]*uf.data*1.19).toFixed(0));
        document.getElementById(`uf_clp_${i}`)!.innerHTML = '$'+ (this.dif[i]*uf.data*1.19).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      }
      document.getElementById(`total_uf_clp`)!.innerHTML = '$'+ this.sumaAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    });
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

  verifyNumber(number: number)
  {
    if (Number.isInteger(number)) {
      return number.toString();  
    } else {
      return number.toFixed(2);  
    }
  }
}
