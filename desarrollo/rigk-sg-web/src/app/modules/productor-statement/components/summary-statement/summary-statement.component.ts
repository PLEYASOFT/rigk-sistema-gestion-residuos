import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductorService } from 'src/app/core/services/productor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-summary-statement',
  templateUrl: './summary-statement.component.html',
  styleUrls: ['./summary-statement.component.css']
})

export class SummaryStatementComponent implements OnInit, AfterViewInit {


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

  diff_one = 0;
  diff_two = 0;
  diff_three = 0;
  constructor(private fb: FormBuilder,
    public productorService: ProductorService,
    private router: Router,
    private actived: ActivatedRoute) {
    this.actived.queryParams.subscribe(r => {
      this.id_business = r['id_business'];
      this.year_statement = r['year'];
    });
  }
  ngAfterViewInit(): void {
    this.detailForm = JSON.parse(sessionStorage.getItem('detailForm')!);
    console.log(this.detailForm);

    this.detailLastForm = JSON.parse(sessionStorage.getItem('detailLastForm')!);
    console.log(this.detailLastForm);
    
    this.generateForm();
    this.generateDiff();
  }

  ngOnInit(): void {
    
  }

  generateForm(){
    this.detailLastForm = JSON.parse(sessionStorage.getItem("detailLastForm")!);
    this.detailForm = JSON.parse(sessionStorage.getItem('detailForm')!);
    for (let i = 0; i < this.detailForm.length; i++) {
      const r = this.detailForm[i];
      (document.getElementById(`td_${r?.recyclability}_${r?.precedence}_${r?.hazard}_${r?.type_residue}`) as HTMLElement).innerHTML = r?.value;
      const tmp_weight = (parseInt((document.getElementById(`actual_weight_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML) || 0) + parseInt(r?.value);
      //const tmp_amount = (parseInt((document.getElementById(`actual_amount_${r?.recyclability}_${r?.type_residue}`) as HTMLElement).innerHTML) || 0) + parseInt(r?.amount);

      (document.getElementById(`actual_weight_${r?.recyclability}_${r.type_residue}`) as HTMLElement).innerHTML = tmp_weight.toString();

      if(r.recyclability == 1)
      {
        this.actual_weight_one = this.actual_weight_one +  parseInt(r?.value);
        (document.getElementById(`td_${r?.recyclability}`) as HTMLElement).innerHTML = this.actual_weight_one.toString();
      }

      else if(r.recyclability == 2)
      {
        this.actual_weight_two = this.actual_weight_two +  parseInt(r?.value);
        (document.getElementById(`td_${r?.recyclability}`) as HTMLElement).innerHTML = this.actual_weight_two.toString();
      }

      else if(r.recyclability == 3)
      {
        this.actual_weight_three = this.actual_weight_three +  parseInt(r?.value);
        (document.getElementById(`td_${r?.recyclability}`) as HTMLElement).innerHTML = this.actual_weight_three.toString();
      }

      
    }

    for (let i = 0; i < this.detailLastForm.length; i++) {
      const r = this.detailLastForm[i];
      (document.getElementById(`td_l_${r?.RECYCLABILITY}_${r?.PRECEDENCE}_${r?.HAZARD}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML = r?.VALUE;
      const tmp_weight = (parseInt((document.getElementById(`l_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML) || 0) + parseInt(r?.VALUE);
      //const tmp_amount = (parseInt((document.getElementById(`actual_amount_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML) || 0) + parseInt(r?.AMOUNT);

      (document.getElementById(`l_weight_${r?.RECYCLABILITY}_${r.TYPE_RESIDUE}`) as HTMLElement).innerHTML = tmp_weight.toString();
      
      if(r.RECYCLABILITY == 1)
      {
        this.last_weight_one = this.last_weight_one +  parseInt(r?.VALUE);
        (document.getElementById(`td_l_${r?.RECYCLABILITY}`) as HTMLElement).innerHTML = this.last_weight_one.toString();
      }

      else if(r.RECYCLABILITY == 2)
      {
        this.last_weight_two = this.last_weight_two +  parseInt(r?.VALUE);
        (document.getElementById(`td_l_${r?.RECYCLABILITY}`) as HTMLElement).innerHTML = this.last_weight_two.toString();
      }

      else if(r.RECYCLABILITY == 3)
      {
        this.last_weight_three = this.last_weight_three +  parseInt(r?.VALUE);
        (document.getElementById(`td_l_${r?.RECYCLABILITY}`) as HTMLElement).innerHTML = this.last_weight_three.toString();
      }
      
    }
  }

  generateDiff()
  {
    for (let i = 0; i < this.detailLastForm.length; i++) {
      const r = this.detailLastForm[i];
      const tmp_weight = (parseInt((document.getElementById(`actual_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML) || 0) + parseInt(r?.VALUE);
      console.log(tmp_weight);
      const tmp_l_weight = (parseInt((document.getElementById(`l_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML) || 0) + parseInt(r?.VALUE);
      (document.getElementById(`diff_${r?.RECYCLABILITY}_${r.TYPE_RESIDUE}`) as HTMLElement).innerHTML = ((tmp_l_weight / tmp_weight) * 100).toFixed(2);

      this.diff_one = this.diff_one +  parseInt(((tmp_l_weight / tmp_weight) * 100).toFixed(2));

      if(r.RECYCLABILITY == 1)
      {
        this.diff_one = this.diff_one +  parseInt(((tmp_l_weight / tmp_weight) * 100).toFixed(2));
        (document.getElementById(`td_diff_${r?.RECYCLABILITY}`) as HTMLElement).innerHTML = this.diff_one.toString();
      }

      else if(r.RECYCLABILITY == 2)
      {
        this.diff_two = this.diff_two +  parseInt(((tmp_l_weight / tmp_weight) * 100).toFixed(2));
        (document.getElementById(`td_diff_${r?.RECYCLABILITY}`) as HTMLElement).innerHTML = this.diff_two.toString();
      }

      else if(r.RECYCLABILITY == 3)
      {
        this.diff_three = this.diff_three +  parseInt(((tmp_l_weight / tmp_weight) * 100).toFixed(2));
        (document.getElementById(`td_diff_${r?.RECYCLABILITY}`) as HTMLElement).innerHTML = this.diff_three.toString();
      }
    }
     
  }
}
