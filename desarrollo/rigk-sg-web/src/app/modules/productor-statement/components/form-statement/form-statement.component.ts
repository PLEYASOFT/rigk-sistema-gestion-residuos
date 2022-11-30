import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductorService } from 'src/app/core/services/productor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-statement',
  templateUrl: './form-statement.component.html',
  styleUrls: ['./form-statement.component.css']
})
export class FormStatementComponent implements OnInit {
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

     constructor(private fb: FormBuilder,
      public productorService: ProductorService,
      private router: Router,
      private actived: ActivatedRoute) {
      this.actived.queryParams.subscribe(r => {
        this.id_business = r['id_business'];
        this.year_statement = r['year'];
      });
    }

  ngOnInit(): void {
    this.getValueStatementByYear();
    this.getDraftStatement();
    Swal.fire({
      title: 'Cargando Datos',
      text: 'Se está recuperando datos',
      timerProgressBar: true,
      showConfirmButton: false
    });
    Swal.showLoading();
  }


  calculateDiff() {
    for (let i = 1; i <= 5; i++) {
      const actual_recyclability_1 = parseInt((document.getElementById(`actual_weight_1_${i}`) as HTMLInputElement).value);
      const actual_recyclability_2 = parseInt((document.getElementById(`actual_weight_2_${i}`) as HTMLInputElement).value);
      const actual_recyclability_3 = parseInt((document.getElementById(`actual_weight_3_${i}`) as HTMLInputElement).value);

      const last_recyclability_1 = parseInt((document.getElementById(`last_weight_1_${i}`) as HTMLInputElement).value);
      const last_recyclability_2 = parseInt((document.getElementById(`last_weight_2_${i}`) as HTMLInputElement).value);
      const last_recyclability_3 = parseInt((document.getElementById(`last_weight_3_${i}`) as HTMLInputElement).value);

      const diff_1 = (((actual_recyclability_1 - last_recyclability_1) / last_recyclability_1) * 100);
      const diff_2 = (((actual_recyclability_2 - last_recyclability_2) / last_recyclability_2) * 100);
      const diff_3 = (((actual_recyclability_3 - last_recyclability_3) / last_recyclability_3) * 100);

      (document.getElementById(`actual_dif_1_${i}`) as HTMLInputElement).value = `${diff_1 == Infinity ? 100 : parseInt(diff_1.toFixed(2)) || 0}%`;
      (document.getElementById(`actual_dif_2_${i}`) as HTMLInputElement).value = `${diff_2 == Infinity ? 100 : parseInt(diff_2.toFixed(2)) || 0}%`;
      (document.getElementById(`actual_dif_3_${i}`) as HTMLInputElement).value = `${diff_3 == Infinity ? 100 : parseInt(diff_3.toFixed(2)) || 0}%`;
    }
  }

  getDraftStatement() {
    this.productorService.getValueStatementByYear(this.id_business, this.year_statement, 1).subscribe(resp => {
      if (resp.status) {
        if (resp.data.header.STATE) {
          this.router.navigate(['/productor/home']);
        }
        this.id_statement = resp.data.header.ID;
        sessionStorage.setItem('id_statement', this.id_statement?.toString() || 'null');

        resp.data.detail.forEach((r: any) => {
          const obj = this.toLowerKeys(r);
          this.detailForm.push(obj);
          (document.getElementById(`inp_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}_${r?.PRECEDENCE}_${r?.HAZARD}`) as HTMLInputElement).value = r?.VALUE;
          const tmp_weight = (parseInt((document.getElementById(`actual_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value) || 0) + parseInt(r?.VALUE);
          const tmp_amount = (parseInt((document.getElementById(`actual_amount_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value) || 0) + parseInt(r?.AMOUNT);

          (document.getElementById(`actual_weight_${r?.RECYCLABILITY}_${r.TYPE_RESIDUE}`) as HTMLInputElement).value = tmp_weight.toString();
          if (r?.RECYCLABILITY >= 2) {
            (document.getElementById(`actual_amount_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value = tmp_amount.toString();
          }

        });
      }
    });
  }

  toLowerKeys(obj: any) {
    const entries = Object.entries(obj);
    return Object.fromEntries(
      entries.map(([key, value]) => {
        return [key.toLowerCase(), value];
      }),
    );
  }

  updateValue(recyclability: any, type_residue: any, precedence: any, hazard: any, target: any) {
    sessionStorage.setItem('isEdited', "true");
    const prices = [16269, 50096, 76560, 17000, 50123];
    this.isEdited = true;
    let tmp;
    let sum = 0;
    let value = parseInt(target.value);
    if (!target.value || target.value < 0) {
      value = 0;
      target.value = 0;
    }

    for (let i = 0; i < this.detailForm.length; i++) {
      const r = this.detailForm[i];
      if (r.type_residue == type_residue && r.recyclability == recyclability) {
        sum += parseInt(r.value || 0);
      }
      if (r.type_residue == type_residue && r.precedence == precedence && r.hazard == hazard && r.recyclability == recyclability) {
        tmp = r;
      }
    }
    if (this.detailForm.length == 0) {
      sum = 0;
    }
    if (tmp) {
      const index = this.detailForm.indexOf(tmp);
      sum = sum - { ...this.detailForm[index] }.value;
      this.detailForm[index].value = value;
      sum += parseInt(this.detailForm[index].value);
    } else {
      sum += value;
      this.detailForm.push({ precedence, hazard, value, type_residue, amount: (sum * 16269), recyclability });
    }

    sessionStorage.setItem('detailForm', JSON.stringify(this.detailForm));

    (document.getElementById(`actual_weight_${recyclability}_${type_residue}`) as HTMLInputElement).value = `${sum}`;
    if (recyclability >= 2) {
      (document.getElementById(`actual_amount_${recyclability}_${type_residue}`) as HTMLInputElement).value = (sum * prices[type_residue - 1]).toString();
    }

    const last_weight = parseInt((document.getElementById(`last_weight_${recyclability}_${type_residue}`) as HTMLInputElement).value);
    const diff = (((sum - last_weight) / last_weight) * 100);
    (document.getElementById(`actual_dif_${recyclability}_${type_residue}`) as HTMLInputElement).value = `${diff == Infinity ? 100 : parseInt(diff.toFixed(2)) || 0}%`;
  }

  getValueStatementByYear() {
    const year = this.year_statement - 1;
    this.productorService.getValueStatementByYear(this.id_business, year, 0).subscribe(r => {
      if (!r.status) {
        Swal.close();
        Swal.fire({
          title: 'Tuvimos problemas',
          text: r.msg,
          icon: 'error'
        }).then(event => {
          if (event.isConfirmed) {
            this.router.navigate(['/productor/home']);
          }
        })
      }
      this.detailLastForm = r.data.detail;
      this.headLastForm = r.data.health;
      Swal.close();

      this.detailLastForm?.forEach(r => {
        console.log(r);
        (document.getElementById(`inp_l_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}_${r?.PRECEDENCE}_${r?.HAZARD}`) as HTMLElement).innerHTML = r?.VALUE;
        const tmp_weight = (parseInt((document.getElementById(`last_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML) || 0) + parseInt(r?.VALUE);
        // const tmp_amount = (parseInt((document.getElementById(`last_amount_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML) || 0) + parseInt(r?.AMOUNT);

        if (r?.RECYCLABILITY >= 2) {
          // (document.getElementById(`last_amount_${r?.RECYCLABILITY}_${r.TYPE_RESIDUE}`) as HTMLElement).innerHTML = tmp_amount.toString();
        }
        (document.getElementById(`last_weight_${r?.RECYCLABILITY}_${r.TYPE_RESIDUE}`) as HTMLElement).innerHTML = tmp_weight.toString();
        
      });
    });
  }

}
