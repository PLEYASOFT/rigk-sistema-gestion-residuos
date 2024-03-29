import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProductorService } from '../../../../core/services/productor.service';
import { BusinessService } from '../../../../core/services/business.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { interval, Subscription } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

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
    'Envases compuestos'
  ];
  /**
   * END BORRAR
   */

  position = 1;
  hour: Date | null = null;
  disableBackButton: boolean = false;
  state: number = 0;
  sessionCheck: Subscription | null = null;

  isSubmited = false;
  isEdited = false;
  _saving = false;

  id_business: number = 0;
  name_business: string = "";
  rut_business: string = "";
  year_statement: number = 0;
  id_statement: number | null = null;

  detailForm: any[] = [];

  constructor(private fb: FormBuilder,
    public productorService: ProductorService,
    public businessService: BusinessService,
    private router: Router,
    private actived: ActivatedRoute) {
    this.actived.queryParams.subscribe(r => {
      this.id_business = r['id_business'];
      this.year_statement = r['year'];
    });
    this.getNameBusiness();
  }

  ngOnDestroy(): void {
    if (!this.isSubmited) {
      this.saveDraft();
    }
    sessionStorage.removeItem('id_statement');
    sessionStorage.removeItem('detailForm');
    sessionStorage.removeItem('saving');
    sessionStorage.removeItem('detailLastForm');
    if (this.sessionCheck !== null) {
      this.sessionCheck.unsubscribe();
    }
  }

  ngOnInit(): void {
    //this.productorService.currentPosition.subscribe(position => this.position = position);
    if (sessionStorage.getItem('state') && sessionStorage.getItem('state') == '2') {
      //this.productorService.changePosition(3);
      this.position = 3;
    }
    this.sessionCheck = interval(100)
      .pipe(
        map(() => parseInt(sessionStorage.getItem('state') || '0')),
        takeWhile((state) => state !== 2, true)
      )
      .subscribe((newState) => {
        if (this.state !== newState) {
          this.state = newState;
          this.updateBackButtonStatus();
        }
      });
  }

  updateBackButtonStatus(): void {
    this.disableBackButton = this.state === 2 && this.position === 3;
  }
  getNameBusiness() {
    this.businessService.getBusiness(this.id_business.toString()).subscribe({
      next: resp => {
        if (resp.status) {
          this.name_business = resp.status[0].NAME;
          this.rut_business = resp.status[0].VAT;
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

  saveDraft() {
    this._saving = true;
    const _continue = sessionStorage.getItem('saving') || false;
    const edited = sessionStorage.getItem('isEdited') || false;
    this.id_statement = parseInt(sessionStorage.getItem('id_statement')!) || null;
    const tmp = sessionStorage.getItem('detailForm');
    const detail = JSON.parse(tmp ? tmp : "[]");
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

    if (flagZero && this.position !== 3) {

      detail.push({ precedence: 1, hazard: 1, recyclability: 1, type_residue: 1, value: 0, amount: 0 });

      Swal.fire({
        icon: 'question',
        title: '¿Formulario vacio?',
        text: 'El formulario tiene todos los valores en cero. ¿Estas seguro de guardar borrador?',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Guardar'
      }).then(r => {
        if (r.isConfirmed) {
          Swal.fire({
            title: 'Guardando Datos',
            text: `Se están guardando datos`,
            timerProgressBar: true,
            showConfirmButton: false
          });
          Swal.showLoading();
          if (this.id_statement == null && !_continue) {
            sessionStorage.setItem('saving', 'true');
            this.productorService.saveForm({ header, detail }).subscribe(r => {
              this.hour = new Date();
              this._saving = false;
              if (r.status) {
                sessionStorage.setItem('id_statement', r.data);
                Swal.close()
              }
              sessionStorage.removeItem('isEdited');
              sessionStorage.removeItem('saving');
            });
          } else {
            if (_continue) return;
            this.productorService.updateValuesStatement(this.id_statement, detail, header).subscribe(r => {
              if (r.status) {
                this._saving = false;
                this.hour = new Date();
                Swal.close()
              }
            });
          }
        } else {
          this.position = 1;
        }
      });
    } else if (tmp === null) {
      this._saving = false;
      return;
    } else {
      if (!edited) {
        this.hour = new Date();
        this._saving = false;
        return;
      }
      if (this.id_statement == null && !_continue) {
        sessionStorage.setItem('saving', 'true');
        this.productorService.saveForm({ header, detail }).subscribe(r => {
          this._saving = false;
          this.hour = new Date();
          if (r.status) {
            sessionStorage.setItem('id_statement', r.data);
          }
          sessionStorage.removeItem('saving');
          sessionStorage.removeItem('isEdited');
        });
      } else {
        if (_continue) return;
        this.productorService.updateValuesStatement(this.id_statement, detail, header).subscribe(r => {
          if (r.status) {
            this._saving = false;
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
    this.updateBackButtonStatus();
  }
}