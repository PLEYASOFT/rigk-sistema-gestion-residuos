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
export class FormComponent implements OnInit {
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


  position = 1;

  isSubmited = false;
  isEdited = false;
  

  id_business: number = 0;
  year_statement: number = 0;
  id_statement: number | null = null;

  detailForm: any[] = [];

  constructor(private fb: FormBuilder,
    public productorService: ProductorService,
    private router: Router,
    private actived: ActivatedRoute) {
    this.actived.queryParams.subscribe(r => {
      this.id_business = r['id_business'];
      this.year_statement = r['year'];
    });
  }

  async ngOnDestroy() {
    this.isEdited = Boolean(sessionStorage.getItem('isEdited') || false);
    if (!this.isSubmited && this.isEdited) {
      await this.submitForm(false);
    }
  }

  ngOnInit(): void {
  }

  optionSelected(index: any) {
    this.position = index;
  }

  submitForm(state = true) {
    
    this.detailForm = JSON.parse(sessionStorage.getItem('detailForm')!);
    this.isEdited = Boolean(sessionStorage.getItem('isEdited') || false);
    this.id_statement = parseInt(sessionStorage.getItem('id_statement')!) || null;
    console.log("eee",this.id_statement);
    

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
            showConfirmButton: false
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
                      this.afterSubmitedForm()
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
                      this.afterSubmitedForm();
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
                      this.afterSubmitedForm();
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
                    this.afterSubmitedForm();
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
    } else {
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
                  this.afterSubmitedForm();
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
                  this.afterSubmitedForm();
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
                 this.afterSubmitedForm();
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
                this.afterSubmitedForm();
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
  }


  afterSubmitedForm() {
    sessionStorage.removeItem('id_statement');
    sessionStorage.removeItem('isEdited');
    this.isSubmited = true;
    this.router.navigate(['/productor/home']);
  }
}