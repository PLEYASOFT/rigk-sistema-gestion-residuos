import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BusinessService } from 'src/app/core/services/business.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import { RatesTsService } from '../../../../core/services/rates.ts.service';

@Component({
  selector: 'app-send-statement',
  templateUrl: './send-statement.component.html',
  styleUrls: ['./send-statement.component.css']
})
export class SendStatementComponent implements OnInit {

  year_statement: number = 0;

  id_business: string = "";
  name_business: string = "";
  rut: string = "";
  loc_address: string = "";
  phone: string = "";
  email: string = "";
  am_first_name: string = "";
  am_last_name: string = "";
  invoice_name: string = "";
  invoice_email: string = "";
  invoice_phone: string = "";
  amountString: string = "";

  amount_current_year: number = 0;
  amount_previous_year: number = 0;
  uf: number = 0.0;
  totalCLP:string = "";
  porcentajeDiff:string = "";

  constructor(public businessService: BusinessService,
    public productorService: ProductorService,
    public rateService: RatesTsService,
    private router: Router,
    private actived: ActivatedRoute) {
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
  }
  getUf() {
    this.rateService.getUF.subscribe(r=>{
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
                this.amount_previous_year = this.amount_previous_year + (parseFloat(reg.AMOUNT)*this.uf);
              }
            }
            this.amount_previous_year = this.amount_previous_year*parseFloat(this.porcentajeDiff) * 0.01*1.19;
            this.amountString = "$" + this.amount_previous_year.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});
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
                this.amount_current_year = this.amount_current_year + (parseFloat(reg.AMOUNT)*this.uf);
              }
            }
            this.amount_current_year = this.amount_current_year*parseFloat(this.porcentajeDiff) * 0.01*1.19
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
}
