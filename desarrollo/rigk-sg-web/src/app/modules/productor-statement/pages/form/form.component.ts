import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductorService } from '../../../../core/services/productor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  header = this.fb.group({
    id_business: [1],
    year_statement: [2022],
    state: [false, []],
    created_by: [9]
  });

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

  constructor(private fb: FormBuilder,
              public productorService: ProductorService,
              private router: Router ) { }

  ngOnInit(): void { 

    this.getValueStatementByYear();

    /**
     * BORRAR
     */

    //  this.detailLastForm.push({
    //   precedence: 1,
    //   hazard: 1,
    //   recyclability: 1,
    //   type_residue: 1,
    //   value: 100,
    //   amount: 100
    // });

    // this.headLastForm = {
    //   id_business: 1,
    //   year_statement: 2021,
    //   amount: 100000,
    //   difference: 12,
    //   state: 1, 
    // }

    /**
     * END borrar
     */

  }

  submitForm() {
    const header = this.header.value;
    const detail = this.detailForm;
    this.productorService.saveForm({header, detail}).subscribe(r=>{
      if(r.status) {
        this.router.navigate(['/productor/inicio']);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Algo salió mal',
          icon: 'error'
        })
      }
    });
  }
  updateValue(type_residue:any, precedence:any, hazard:any,target:any) {
    let last_weight = 0;
    let last_amount = 0;

    let tmp;
    let sum = 0;
    let value = parseInt(target.value);
    if(!target.value) {
      value = 0;
    }

    // LAST STATEMENT

    console.log(this.detailLastForm)

    this.detailLastForm.forEach(r=>{
      if(r.TYPE_RESIDUE == type_residue) {
        console.log(r)
        last_weight += parseInt(r.VALUE);
        last_amount += parseInt(r.AMOUNT);

      }
    });
    (document.getElementById(`last_weight_${type_residue}`) as HTMLInputElement).value = last_weight.toString();
    (document.getElementById(`last_amount_${type_residue}`) as HTMLInputElement).value = last_amount.toString();
    
    // ACTUAL STATEMENT

    this.detailForm.forEach(r=>{
      sum +=parseInt(r.value);
      if(r.TYPE_RESIDUE = type_residue && r.PRECEDENCE == precedence && r.HAZARD == hazard) {
        tmp = r;
      }
    });
    if(this.detailForm.length == 0) {
      sum = 0;
    }
    
    if(tmp) {
      const index = this.detailForm.indexOf(tmp);
      sum -= {...this.detailForm[index]}.value;

      this.detailForm[index].value = value;
      sum += this.detailForm[index].value;
    } else {
      sum += value;
      this.detailForm.push({precedence,hazard,value,type_residue,amount:(sum * 16269), recyclability:1});
    }

    (document.getElementById(`actual_weight_${type_residue}`) as HTMLInputElement).value = sum.toString();
    (document.getElementById(`actual_amount_${type_residue}`) as HTMLInputElement).value = (sum * 16269).toString();
    (document.getElementById(`actual_dif_${type_residue}`) as HTMLInputElement).value = `${(((sum-last_weight)/last_weight)*100).toFixed(2)}%`;
  }


  getValueStatementByYear() {
    const year = new Date().getFullYear() -1;
    this.productorService.getValueStatementByYear(this.header.value.id_business, year).subscribe(r=>{
      this.detailLastForm = r.data.detail;
      this.headLastForm = r.data.health;
    });
  }
}