import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BusinessService } from 'src/app/core/services/business.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import { RatesTsService } from '../../../../core/services/rates.ts.service';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-send-statement',
  templateUrl: './send-statement.component.html',
  styleUrls: ['./send-statement.component.css']
})
export class SendStatementComponent implements OnInit, OnDestroy {

  year_statement: number = 0;
  isValidated = false;
  fileName = '';
  fileBuffer: any;
  selectedFile: File | null = null;
  userForm: any;
  isButtonVisible = true;
  resume: any;
  id_business: string = "";
  name_business: string = "";
  rut: string = "";
  loc_address: string = "";
  phone: string = "";
  email: string = "";
  am_first_name: string = "";
  am_last_name: string = "";
  giro: string = "";
  invoice_name: string = "";
  invoice_email: string = "";
  invoice_phone: string = "";
  amountString: string = "$0";

  amount_current_year: number = 0;
  amount_previous_year: number = 0;
  uf: number = 0.0;
  totalCLP: string = "";
  porcentajeDiff: string = "";

  constructor(public businessService: BusinessService,
    public productorService: ProductorService,
    public rateService: RatesTsService,
    private actived: ActivatedRoute,
    private fb: FormBuilder) {
    this.actived.queryParams.subscribe(r => {
      this.id_business = r['id_business'];
      this.year_statement = r['year'];
    });
  }

  ngOnInit(): void {
    this.isValidated = false; // iniciar como no validado
    this.isButtonVisible = true; // iniciar con el botón visible
    this.getResume();
    this.getUf();
    this.getBusiness();
    this.getAmountDiff();
    this.totalCLP = sessionStorage.getItem('totalCLP')!
    this.porcentajeDiff = sessionStorage.getItem('porcentajeDiff')!
    this.userForm = this.fb.group({
      ARCHIVO: [null, [Validators.required, this.fileTypeValidator, this.fileSizeValidator]],
    });
  }

  ngOnDestroy(): void {
    // Eliminar la variable de sesión cuando se abandona la vista
    sessionStorage.removeItem('state');
  }
  getUf() {
    this.rateService.getUF.subscribe(r => {
      this.uf = r.data;
    })
  }

  getBusiness() {
    this.businessService.getBusiness(this.id_business).subscribe({
      next: resp => {
        if (resp.status) {
          this.name_business = resp.status[0].NAME;
          this.rut = resp.status[0].VAT;
          this.loc_address = resp.status[0].LOC_ADDRESS;
          this.phone = resp.status[0].PHONE;
          this.email = resp.status[0].EMAIL;
          this.am_first_name = resp.status[0].AM_FIRST_NAME;
          this.am_last_name = resp.status[0].AM_LAST_NAME;
          this.invoice_name = resp.status[0].INVOICE_NAME;
          this.invoice_email = resp.status[0].INVOICE_EMAIL;
          this.invoice_phone = resp.status[0].INVOICE_PHONE;
          this.giro = resp.status[0].GIRO;
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
  remaining = -1;
  getResume() {
    this.actived.queryParams.subscribe(params => {
      let year = params['year'];
      let id_business = params['id_business'];

      // Mostrar el modal de carga
      Swal.fire({
        title: 'Cargando datos...',
        allowOutsideClick: false
      });
      Swal.showLoading();

      this.productorService.getResumeById(id_business, year).subscribe({
        next: resp => {
          console.log(resp)
          this.resume = resp;
          this.remaining = resp.remaining;
          sessionStorage.setItem('state', this.resume.state);
          Swal.close();

          if (this.resume.state == 2) {
            this.isValidated = true;
            this.isButtonVisible = false;
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
    });
  }


  getAmountDiff() {
    this.amount_previous_year = 0;
    this.amount_current_year = 0;

    this.productorService.getValueStatementByYear(this.id_business, this.year_statement - 1, 0).subscribe({
      next: resp => {

        if (resp.status) {
          if (resp.data.detail.length > 0) {
            for (let i = 0; i < resp.data.detail.length; i++) {
              const reg = resp.data.detail[i];
              if (reg.AMOUNT != 0) {
                this.amount_previous_year = this.amount_previous_year + (parseFloat(reg.AMOUNT) * this.uf);
              }
            }
            this.amount_previous_year = this.amount_previous_year * parseFloat(this.porcentajeDiff) * 0.01 * 1.19;
            this.amountString = "$" + this.amount_previous_year.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
          }
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

    this.productorService.getValueStatementByYear(this.id_business, this.year_statement, 1).subscribe({
      next: resp => {
        if (resp.status) {
          if (resp.data.detail.length > 0) {
            for (let i = 0; i < resp.data.detail.length; i++) {
              const reg = resp.data.detail[i];
              if (reg.AMOUNT != 0) {
                this.amount_current_year = this.amount_current_year + (parseFloat(reg.AMOUNT) * this.uf);
              }
            }
            this.amount_current_year = this.amount_current_year * parseFloat(this.porcentajeDiff) * 0.01 * 1.19
          }
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

  async validate() {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: 'Está a punto de validar la declaración, a partir de este momento no va a poder cambiar los valores ingresados y el valor de la declaración quedará fijado a la UF del día de hoy. Tiene un plazo de 7 días para subir la Orden de Compra en el campo que se habilitará al cerrar este mensaje. Pasado este plazo, la declaración volverá a estado borrador y se recalculará el valor de la UF',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    })

    if (result.isConfirmed) {
      const id_statement = sessionStorage.getItem('id_statement');
      if (!id_statement) {
        return;
      }
      this.productorService.validateStatement(id_statement).subscribe({
        next: resp => {
          if (resp.status) {
            this.isValidated = true;
            this.isButtonVisible = false;
            sessionStorage.setItem('state', '2');
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
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      this.fileBuffer = file;
      this.selectedFile = input.files[0];

      const allowedExtensions = ['pdf'];
      const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase() || '';
      const isValid = allowedExtensions.includes(fileExtension);

      if (!isValid) {
        this.userForm.controls['ARCHIVO'].setErrors({ 'invalidFileType': true });
        this.userForm.controls['ARCHIVO'].markAsTouched();
      } else if (file.size > 1 * 1024 * 1024) {
        this.userForm.controls['ARCHIVO'].setErrors({ 'invalidFileSize': true });
        this.userForm.controls['ARCHIVO'].markAsTouched();
      } else {
        this.userForm.controls['ARCHIVO'].setErrors(null);
        this.userForm.controls['ARCHIVO'].markAsTouched();
      }
    } else {
      this.selectedFile = null;
    }
  }

  fileTypeValidator(control: AbstractControl): { [key: string]: any } | null {
    const file = control.value;
    if (file) {
      const allowedFileTypes = ['application/pdf', 'image/jpeg'];
      if (!allowedFileTypes.includes(file.type)) {
        return { invalidFileType: true };
      }
    }
    return null;
  }

  fileSizeValidator(control: AbstractControl): { [key: string]: any } | null {
    const file = control.value;
    if (file) {
      const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB
      if (file.size > maxSizeInBytes) {
        return { invalidFileSize: true };
      }
    }
    return null;
  }

  uploadDeclaration() {
    const file = this.userForm.get('ARCHIVO').value;
    const files = (document.getElementById('inp_archivo') as HTMLInputElement).files;
    const id_statement = sessionStorage.getItem('id_statement');
    if (!id_statement) {
      return;
    }

    Swal.fire({
      title: 'Subiendo archivo',
      text: 'Espere mientras se sube el archivo...',
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.productorService.uploadOC(id_statement, files).subscribe({
      next: resp => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Archivo subido exitosamente',
          text: 'La declaración se ha enviado correctamente.',
          showConfirmButton: true
        }).then(() => {
          window.location.href = '/#';
        });
      },
      error: error => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error al subir el archivo',
          text: 'Ha ocurrido un error al subir la declaración. Por favor, inténtelo nuevamente.',
          showConfirmButton: true
        });
      }
    });
  }

  getTotalEyE() {
    let metal = parseFloat(this.resume?.metal.replace(',', '.'));
    let papel = parseFloat(this.resume?.papel.replace(',', '.'));
    let plastico = parseFloat(this.resume?.plastico.replace(',', '.'));
    let no_reciclable = parseFloat(this.resume?.no_reciclable.replace(',', '.'));

    let total = metal + papel + plastico + no_reciclable;
    return (total || 0).toFixed(2).replace('.', ',');
  }

  getNeto() {
    return this.formatMoney(this.resume?.neto);
  }

  getIVA() {
    return this.formatMoney(this.resume?.iva);
  }

  getTotalFacturado() {
    let neto = this.parseMoney(this.getNeto());
    let iva = this.parseMoney(this.getIVA());
    let total = neto + iva;

    return this.formatMoney(total.toFixed(0));
  }

  parseMoney(value: string) {
    let newValue = value.replace(/\./g, '');
    newValue = newValue.replace(',', '.');
    return parseFloat(newValue);
  }

  formatMoney(value: string) {
    let number = parseFloat(value);
    return number.toFixed(0).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  formatNumber(numStr: string) {
    if (!numStr) {
      return '';
    }
    const parts = numStr.split(',');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  }

}
