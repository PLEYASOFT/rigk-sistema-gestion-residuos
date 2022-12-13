import { Component, Input, OnInit, OnChanges, SimpleChanges, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductorService } from '../../../../core/services/productor.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {
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
  hour: Date | null = null;

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
  ngOnDestroy(): void {
    this.saveDraft();
    sessionStorage.removeItem('id_statement');
    sessionStorage.removeItem('detailForm');
    sessionStorage.removeItem('detailLastForm');

  }

  ngOnInit(): void {
  }

  saveDraft() {
    this.id_statement = parseInt(sessionStorage.getItem('id_statement')!) || null;
    const detail = JSON.parse(sessionStorage.getItem('detailForm')!) || [];
    let flagZero = true;
    for (let i = 0; i < detail.length; i++) {
      const reg = detail[i];
      if (reg.value != 0) {
        flagZero = false;
      }
    }
    const header = {
      id_business: this.id_business,
      year_statement: this.year_statement,
      state: false,
      id_statement: this.id_statement
    };

    if (flagZero) {
      detail.push({
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
          if (this.id_statement == null) {
            this.productorService.saveForm({ header, detail }).subscribe(r => {
              this.hour = new Date();
              if (r.status) {
                sessionStorage.setItem('id_statement', r.data);
                Swal.close()
              }
            });
          } else {
            this.productorService.updateValuesStatement(this.id_statement, detail, header).subscribe(r => {
              if (r.status) {
                this.hour = new Date();
                Swal.close()
              }
            });
          }
        } else {
          this.position = 1;
        }
      });
    } else {
      if (this.id_statement == null) {
        this.productorService.saveForm({ header, detail }).subscribe(r => {
          this.hour = new Date();
          if (r.status) {
            sessionStorage.setItem('id_statement', r.data);
          }
        });
      } else {
        this.productorService.updateValuesStatement(this.id_statement, detail, header).subscribe(r => {
          if (r.status) {
            this.hour = new Date();
          }
        });
      }
    }
  }

  updateFormState() {
    this.id_statement = parseInt(sessionStorage.getItem('id_statement')!) || null;
    Swal.fire({
      icon: 'question',
      title: 'Confirmación Envío',
      text: 'Usted está a punto de enviar su declaración. Una vez enviada, no podrá realizar modificaciones sobre la misma. ¿Esta seguro de realizar el envío?',
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: true
    }).then(r => {
      if (r.isConfirmed) {
        this.productorService.updateStateStatement(this.id_statement, true).subscribe(r => {
          Swal.fire({
            title: 'Exito',
            text: 'La declaración fue enviada exitosamente',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: true
          }).then(r => {
            sessionStorage.removeItem('id_statement');
            sessionStorage.removeItem('isEdited');
            this.isSubmited = true;
            this.router.navigate(['/productor/home']);
          });
        });
      }
    });
  }

  changeStep(val: number) {
    if (this.position == 0) {
      this.position = 1;
      return;
    }
    if (this.position >= 1 && this.position < 3 && val > 0) {
      this.saveDraft();
    }
    if (val > 0) {
      if (this.position < 3) {
        this.position += val;
      }
    } else {
      if (this.position > 1) {
        this.position += val;
      }
    }
  }
}