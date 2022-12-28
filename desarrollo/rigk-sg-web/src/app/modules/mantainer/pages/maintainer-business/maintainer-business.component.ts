import { Component, OnInit } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maintainer-business',
  templateUrl: './maintainer-business.component.html',
  styleUrls: ['./maintainer-business.component.css']
})
export class MaintainerBusinessComponent implements OnInit {

  popupVisible = false;
  nombre = '';
  rut2 = '';
  id_business: string [] = [];
  name_business: string [] = [];
  rut: string [] = [];
  loc_address: string [] = [];
  phone: string [] = [];
  email: string [] = [];
  am_first_name: string [] = [];
  am_last_name: string [] = [];
  invoice_name: string [] = [];
  invoice_email: string [] = [];
  invoice_phone: string [] = [];

  amount_current_year: number = 0;
  amount_previous_year: number = 0;
  userData: any | null;

  constructor(public businessService: BusinessService,
    public productorService: ProductorService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllBusiness();
  }

  getAllBusiness() {
    this.businessService.getAllBusiness().subscribe({
      next: resp => {
        console.log(resp.status[0]);
        if (resp.status) {
          for(let i = 0; i < resp.status.length; i++)
          {
            this.id_business.push(resp.status[i].ID) ;
            this.name_business.push(resp.status[i].NAME) ;
            this.rut.push(resp.status[i].VAT) ;
            this.loc_address.push(resp.status[i].LOC_ADDRESS) ;
            this.phone.push(resp.status[i].PHONE) ;
            this.email.push(resp.status[i].EMAIL) ;
            this.am_first_name.push(resp.status[i].AM_FIRST_NAME) ;
            this.am_last_name.push(resp.status[i].AM_LAST_NAME) ;
            this.invoice_name.push(resp.status[i].INVOICE_NAME) ;
            this.invoice_email.push(resp.status[i].INVOICE_EMAIL) ;
            this.invoice_phone.push(resp.status[i].INVOICE_PHONE) ;
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
