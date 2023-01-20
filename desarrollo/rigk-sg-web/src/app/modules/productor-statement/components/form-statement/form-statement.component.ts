import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, AfterContentInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductorService } from 'src/app/core/services/productor.service';
import Swal from 'sweetalert2';
import { RatesTsService } from '../../../../core/services/rates.ts.service';

@Component({
  selector: 'app-form-statement',
  templateUrl: './form-statement.component.html',
  styleUrls: ['./form-statement.component.css']
})
export class FormStatementComponent implements OnInit, AfterViewChecked, OnDestroy {
  /**
 * BORRAR
 */
  tablas = ['EyE Reciclables', 'EyE No Reciclables', 'EyE Retornables / Reutilizados'];
  residuos = [
    'Papel/Cartón',
    'Metal',
    'Plástico',
    'Madera',
    'Envases compuestos'
  ];
  /**
   * END BORRAr
   */

  showOtherEnvInNoRecyclableTable: boolean = false;
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

  rates: any[] = [];

  constructor(private fb: FormBuilder,
    public productorService: ProductorService,
    private router: Router,
    private actived: ActivatedRoute,
    public ratesService: RatesTsService,
    private currencyPipe: CurrencyPipe) {
    this.actived.queryParams.subscribe(r => {
      this.id_business = r['id_business'];
      this.year_statement = r['year'];
    });
  }
  ngOnDestroy(): void {
    // sessionStorage.removeItem('isEdited');
  }

  ngOnInit(): void {
    Swal.fire({
      title: 'Cargando Datos',
      text: 'Se está recuperando datos',
      timerProgressBar: true,
      showConfirmButton: false
    });
    Swal.showLoading();
    this.ratesService.getCLP.subscribe({
      next: r => {
        this.rates = r.data;
        this.getDraftStatement();
        this.getValueStatementByYear();
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

  ngAfterViewChecked(): void {
    this.calculateDiff();
  }

  calculateDiff() {
    let amount_1 = 0.0;
    let amount_2 = 0.0;
    let amount_3 = 0.0;
    let weight_1 = 0.0;
    let weight_2 = 0.0;
    let weight_3 = 0.0;
    for (let i = 1; i <= 5; i++) {
      const actual_recyclability_1 = parseFloat((document.getElementById(`actual_weight_1_${i}`) as HTMLInputElement).value);
      const actual_recyclability_2 = parseFloat((document.getElementById(`actual_weight_2_${i}`) as HTMLInputElement).value);
      const actual_recyclability_3 = parseFloat((document.getElementById(`actual_weight_3_${i}`) as HTMLInputElement).value);

      const last_recyclability_1 = parseFloat((document.getElementById(`last_weight_1_${i}`) as HTMLElement).innerHTML);
      const last_recyclability_2 = parseFloat((document.getElementById(`last_weight_2_${i}`) as HTMLElement).innerHTML);
      const last_recyclability_3 = parseFloat((document.getElementById(`last_weight_3_${i}`) as HTMLElement).innerHTML);

      let diff_1 = actual_recyclability_1-last_recyclability_1;
      let diff_2 = actual_recyclability_2-last_recyclability_2;
      let diff_3 = actual_recyclability_3-last_recyclability_3;

      if(last_recyclability_1 == 0) {
        diff_1 = 0;
      }
      if(last_recyclability_2 == 0) {
        diff_2 = 0;
      }
      if(last_recyclability_3 == 0) {
        diff_3 = 0;
      }
      
      amount_1 += parseFloat((document.getElementById(`actual_amount_1_${i}`) as HTMLInputElement).value.replace(",",".")) || 0;
      amount_2 += parseFloat((document.getElementById(`actual_amount_2_${i}`) as HTMLInputElement).value.replace(",",".")) || 0;
      amount_3 += parseFloat((document.getElementById(`actual_amount_3_${i}`) as HTMLInputElement).value.replace(",",".")) || 0;

      weight_1 += parseFloat((document.getElementById(`actual_weight_1_${i}`) as HTMLInputElement).value.replace(",",".")) || 0;
      weight_2 += parseFloat((document.getElementById(`actual_weight_2_${i}`) as HTMLInputElement).value.replace(",",".")) || 0;
      weight_3 += parseFloat((document.getElementById(`actual_weight_3_${i}`) as HTMLInputElement).value.replace(",",".")) || 0;

      // const amount_2 = parseFloat((document.getElementById(`actual_amount_1_${i+1}`) as HTMLInputElement).value);
      // const amount_3 = parseFloat((document.getElementById(`actual_amount_1_${i+1}`) as HTMLInputElement).value);

      (document.getElementById(`actual_dif_1_${i}`) as HTMLInputElement).value = `${diff_1 == Infinity ? 100 : (diff_1.toFixed(2)) || 0}`;
      (document.getElementById(`actual_dif_2_${i}`) as HTMLInputElement).value = `${diff_2 == Infinity ? 100 : (diff_2.toFixed(2)) || 0}`;
      (document.getElementById(`actual_dif_3_${i}`) as HTMLInputElement).value = `${diff_3 == Infinity ? 100 : (diff_3.toFixed(2)) || 0}`;
    }
    (document.getElementById(`total_amount_1`) as HTMLSpanElement).innerHTML = amount_1.toFixed(2).replace(".",",");
    (document.getElementById(`total_amount_2`) as HTMLSpanElement).innerHTML = amount_2.toFixed(2).replace(".",",");
    (document.getElementById(`total_amount_3`) as HTMLSpanElement).innerHTML = amount_3.toFixed(2).replace(".",",");

    (document.getElementById(`total_weight_1`) as HTMLSpanElement).innerHTML = weight_1.toString();
    (document.getElementById(`total_weight_2`) as HTMLSpanElement).innerHTML = weight_2.toString();
    (document.getElementById(`total_weight_3`) as HTMLSpanElement).innerHTML = weight_3.toString();
    
  }

  getDraftStatement() {
    this.detailForm = [];
    this.productorService.getValueStatementByYear(this.id_business, this.year_statement, 1).subscribe({
      next: resp => {
        if (resp.status) {
          if (resp.data.header.STATE) {
            this.router.navigate(['/productor/home']);
          }
          this.id_statement = resp.data.header.ID;
          sessionStorage.setItem('isEdited', 'true');
          sessionStorage.setItem('id_statement', this.id_statement?.toString() || 'null');
          for (let i = 0; i < resp.data.detail.length; i++) {
            const r = resp.data.detail[i];
            const obj = this.toLowerKeys(r);
            if (r?.VALUE == 0) continue;

            (document.getElementById(`inp_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}_${r?.PRECEDENCE}_${r?.HAZARD}`) as HTMLInputElement).value = r?.VALUE;
            const tmp_weight = (parseFloat((document.getElementById(`actual_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value) || 0) + parseFloat(r?.VALUE);
            let amount = 0;
            if (r.RECYCLABILITY == 1 && r.TYPE_RESIDUE <= 3) {
              amount = r?.VALUE * this.rates[r.TYPE_RESIDUE - 1].price;
            } else if (r.RECYCLABILITY == 2 && r.TYPE_RESIDUE <= 3) {
              amount = r?.VALUE * this.rates[3].price
            } else {
              amount = 0;
            }
            const target = (document.getElementById(`actual_amount_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value.replace("$", "").replace(",", ".");
            const tmp_amount: number = (parseFloat(target) || 0) + amount;
            obj['amount'] = amount;
            this.detailForm.push(obj);

            (document.getElementById(`actual_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value = tmp_weight.toString().replace(".",",");
            (document.getElementById(`actual_amount_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value = tmp_amount.toFixed(2).replace(".",",") || "";
            // this.calculateDiff();
          }
          sessionStorage.setItem('detailForm', JSON.stringify(this.detailForm));
        }
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
    let tmp;
    let sum = 0;
    let amount: number | string = 0;

    const pattern = /^[0-9]+(,[0-9]+)?$/;
    if (!pattern.test(target.value)) {
      target.value = 0;
    }

    let value = parseFloat(target.value.replace(",", "."));
    if (!target.value || isNaN(value) || value < 0) {
      value = 0;
      target.value = 0;
    }

    for (let i = 0; i < this.detailForm.length; i++) {
      const r = this.detailForm[i];
      if (r.type_residue == type_residue && r.recyclability == recyclability) {
        sum += parseFloat(r.value || 0);
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
      sum += parseFloat(this.detailForm[index].value);

      if (recyclability == 1 && type_residue <= 3) {
        amount = value * this.rates[type_residue - 1].price;
      } else if (recyclability == 2 && type_residue <= 3) {
        amount = value * this.rates[3].price
      } else {
        amount = 0;
      }
      this.detailForm[index].amount = amount;
    } else {
      sum += value;
      if (recyclability == 1 && type_residue <= 3) {
        amount = value * this.rates[type_residue - 1].price;
      } else if (recyclability == 2 && type_residue <= 3) {
        amount = value * this.rates[3].price
      } else {
        amount = 0;
      }
      this.detailForm.push({ precedence, hazard, value, type_residue, amount, recyclability });
    }

    if (recyclability == 1 && type_residue <= 3) {
      amount = ((this.rates[type_residue - 1].price) * sum).toString();
    } else if (recyclability == 2 && (type_residue <= 3 || type_residue==5)) {
      amount = (((this.rates[3].price) * sum)).toString();
    } else {
      amount = "0";
    }

    sessionStorage.setItem('detailForm', JSON.stringify(this.detailForm));

    (document.getElementById(`actual_weight_${recyclability}_${type_residue}`) as HTMLInputElement).value = `${sum.toString().replace(".", ",")}`;
    (document.getElementById(`actual_amount_${recyclability}_${type_residue}`) as HTMLInputElement).value = parseFloat(amount).toFixed(2).replace(".",",");

    const last_weight = parseFloat((document.getElementById(`last_weight_${recyclability}_${type_residue}`) as HTMLElement).innerHTML);
    const diff = sum-last_weight;
    (document.getElementById(`actual_dif_${recyclability}_${type_residue}`) as HTMLInputElement).value = `${diff == Infinity ? 100 : (diff.toFixed(2)) || 0} `;
    // this.calculateDiff();

  }

  getValueStatementByYear() {
    const year = this.year_statement - 1;
    this.productorService.getValueStatementByYear(this.id_business, year, 0).subscribe({
      next: r => {
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
        sessionStorage.setItem('detailLastForm', JSON.stringify(this.detailLastForm) || '""');
        this.headLastForm = r.data.health;
        Swal.close();
        this.detailLastForm?.forEach(r => {
          (document.getElementById(`inp_l_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}_${r?.PRECEDENCE}_${r?.HAZARD}`) as HTMLElement).innerHTML = r?.VALUE.toFixed(2).replace(".",",");
          const tmp_weight = (parseFloat((document.getElementById(`last_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML) || 0) + parseFloat(r?.VALUE);
          (document.getElementById(`last_weight_${r?.RECYCLABILITY}_${r.TYPE_RESIDUE}`) as HTMLElement).innerHTML = tmp_weight.toString().replace(".",",");
        });
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
}
