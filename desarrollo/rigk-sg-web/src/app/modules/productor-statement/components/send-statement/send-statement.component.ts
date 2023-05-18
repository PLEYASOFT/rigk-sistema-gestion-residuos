import { Component, OnInit } from '@angular/core';
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
export class SendStatementComponent implements OnInit {

  year_statement: number = 0;
  isValidated = false;
  fileName = '';
  fileBuffer: any;
  selectedFile: File | null = null;
  userForm: any;
  
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
    private router: Router,
    private actived: ActivatedRoute,
    private fb: FormBuilder) {
    this.actived.queryParams.subscribe(r => {
      this.id_business = r['id_business'];
      this.year_statement = r['year'];
    });
  }

  ngOnInit(): void {
    this.getUf();
    this.getBusiness();
    this.getAmountDiff();
    this.totalCLP = sessionStorage.getItem('totalCLP')!
    this.porcentajeDiff = sessionStorage.getItem('porcentajeDiff')!
    this.userForm = this.fb.group({
      ARCHIVO: [null, [Validators.required, this.fileTypeValidator, this.fileSizeValidator]],
    });
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

  validate() {
    if (window.confirm('¿Estás seguro que quieres validar?')) {
      this.isValidated = true;
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
}
