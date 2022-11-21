import { Component, Input, OnInit, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductorService } from '../../../../core/services/productor.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewChecked {
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
  ngAfterViewChecked(): void {
    this.calculateDiff();
  }

  async ngOnDestroy() {
    if (!this.isSubmited && this.isEdited) {
      await this.submitForm(false);
    }
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

      let diff_1 = (((actual_recyclability_1 - last_recyclability_1) / last_recyclability_1) * 100);
      let diff_2 = (((actual_recyclability_2 - last_recyclability_2) / last_recyclability_2) * 100);
      let diff_3 = (((actual_recyclability_3 - last_recyclability_3) / last_recyclability_3) * 100);

      if(diff_1.toFixed(2) == "NaN" || diff_1 == NaN) {
        diff_1 = 0;
      } else {
        diff_1 = parseInt(diff_1.toFixed(2));
      }
      if(diff_2.toFixed(2) == "NaN" || diff_2 == NaN) {
        diff_2 = 0;
      } else {
        diff_2 = parseInt(diff_2.toFixed(2));
      }
      if(diff_3.toFixed(2) == "NaN" || diff_3 == NaN) {
        diff_3 = 0;
      } else {
        diff_3 = parseInt(diff_3.toFixed(2));
      }


      (document.getElementById(`actual_dif_1_${i}`) as HTMLInputElement).value = `${diff_1 == Infinity ? 100 : diff_1 || 0}%`;
      (document.getElementById(`actual_dif_2_${i}`) as HTMLInputElement).value = `${diff_2 == Infinity ? 100 : diff_2 || 0}%`;
      (document.getElementById(`actual_dif_3_${i}`) as HTMLInputElement).value = `${diff_3 == Infinity ? 100 : diff_3 || 0}%`;
    }
  }

  getDraftStatement() {
    this.productorService.getValueStatementByYear(this.id_business, this.year_statement).subscribe(resp => {
      if (resp.status) {
        if (resp.data.header.STATE) {
          this.router.navigate(['/productor/home']);
        }
        this.id_statement = resp.data.header.ID;

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
  submitForm(state = true) {
    let flagZero = true;
    for (let i = 0; i < this.detailForm.length; i++) {
      const reg = this.detailForm[i];
      if (reg.value != 0) {
        flagZero = false;
      }
    }

    if (flagZero) {
      this.detailForm.push({
        precedence: 1,
        hazard: 1,
        recyclability: 1,
        type_residue: 1,
        value: 0,
        amount: 0
      })
      Swal.fire({
        icon: 'question',
        title: '¿Formulario vacio?',
        text: 'El formulario tiene todos los valores en cero. ¿Estas seguro de enviarlo?',
        showConfirmButton: true,
        showCancelButton: true
      }).then(r => {
        if (r.isConfirmed) {
          Swal.fire({
            title: 'Guardando Datos',
            text: `Se están guardando datos`,
            timerProgressBar: true,
            showConfirmButton: false,
            willClose: () => {

            }
          });
          Swal.showLoading();

          const detail = this.detailForm;
          const header = {
            id_business: this.id_business,
            year_statement: this.year_statement,
            state,
            id_statement: this.id_statement
          }

          if (this.id_statement && state) {
            if (!this.isEdited) {
              this.productorService.updateStateStatement(this.id_statement, state).subscribe(r => {
                if (r.status) {
                  Swal.close();
                  Swal.fire({
                    title: 'Datos Guardados',
                    text: `La información se guardó correctamente`,
                    icon: 'success'
                  }).then(result => {
                    if (result.isConfirmed) {
                      this.isSubmited = true;
                      this.router.navigate(['/productor/home']);
                    }
                  });
                } else {
                  Swal.close();
                  Swal.fire({
                    title: 'Datos Guardados',
                    text: r.msg,
                    icon: 'success'
                  }).then(result => {
                    if (result.isConfirmed) {
                      this.isSubmited = true;
                      this.router.navigate(['/productor/home']);
                    }
                  });
                }
              });
            } else {
              this.productorService.updateValuesStatement(this.id_statement, this.detailForm, header).subscribe(r => {
                if (r.status) {
                  Swal.fire({
                    title: 'Datos Guardados',
                    text: `Se a publicado declaración`,
                    icon: 'success'
                  }).then(result => {
                    if (result.isConfirmed) {
                      this.isSubmited = true;
                      this.router.navigate(['/productor/home']);
                    }
                  });
                }
              })
            }
          } else {
            this.productorService.saveForm({ header, detail }).subscribe(r => {
              if (r.status) {
                Swal.close();
                Swal.fire({
                  title: 'Datos Guardados',
                  text: `La información se guardó correctamente`,
                  icon: 'success'
                }).then(result => {
                  if (result.isConfirmed) {
                    this.isSubmited = true;
                    this.router.navigate(['/productor/home']);
                  }
                });
              } else {
                Swal.fire({
                  title: 'Error',
                  text: 'Algo salió mal',
                  icon: 'error'
                })
              }
            });
          }
        }
      })
    }
  }
  updateValue(recyclability: any, type_residue: any, precedence: any, hazard: any, target: any) {
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

    (document.getElementById(`actual_weight_${recyclability}_${type_residue}`) as HTMLInputElement).value = `${sum}`;
    if (recyclability >= 2) {
      (document.getElementById(`actual_amount_${recyclability}_${type_residue}`) as HTMLInputElement).value = (sum * prices[type_residue - 1]).toString();
    }

    const last_weight = parseInt((document.getElementById(`last_weight_${recyclability}_${type_residue}`) as HTMLInputElement).value);
    const diff = (((sum - last_weight) / last_weight) * 100);
    (document.getElementById(`actual_dif_${recyclability}_${type_residue}`) as HTMLInputElement).value = `${diff == Infinity ? 100 : diff.toFixed(2) || 0}%`;
  }

  getValueStatementByYear() {
    const year = this.year_statement - 1;
    this.productorService.getValueStatementByYear(this.id_business, year).subscribe(r => {
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
        (document.getElementById(`inp_l_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}_${r?.PRECEDENCE}_${r?.HAZARD}`) as HTMLInputElement).value = r?.VALUE;
        const tmp_weight = (parseInt((document.getElementById(`last_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value) || 0) + parseInt(r?.VALUE);
        const tmp_amount = (parseInt((document.getElementById(`last_amount_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value) || 0) + parseInt(r?.AMOUNT);

        if (r?.RECYCLABILITY >= 2) {
          (document.getElementById(`last_amount_${r?.RECYCLABILITY}_${r.TYPE_RESIDUE}`) as HTMLInputElement).value = tmp_amount.toString();
        }
        (document.getElementById(`last_weight_${r?.RECYCLABILITY}_${r.TYPE_RESIDUE}`) as HTMLInputElement).value = tmp_weight.toString();
      });
    });
  }
}