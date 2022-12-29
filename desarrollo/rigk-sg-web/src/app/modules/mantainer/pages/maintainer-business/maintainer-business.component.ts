import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { BusinessService } from 'src/app/core/services/business.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maintainer-business',
  templateUrl: './maintainer-business.component.html',
  styleUrls: ['./maintainer-business.component.css']
})
export class MaintainerBusinessComponent implements OnInit {

  formData: FormGroup = this.fb.group({
    nombre : ['', [Validators.required]],
    rut : ['', [Validators.required, Validators.minLength(3)]],
    direccion : ['', [Validators.required, Validators.minLength(3)]],
    telefono  : ['', [Validators.required]],
    email : ['', [Validators.required, Validators.minLength(3)]],
    nombreAccountManager  : ['', [Validators.required, Validators.minLength(3)]],
    apellidoAccountManager   : ['', [Validators.required]],
    nombreContactoFacturacion  : ['', [Validators.required, Validators.minLength(3)]],
    emailContactoFacturacion   : ['', [Validators.required, Validators.minLength(3)]],
    telefonoContactoFacturacion    : ['', [Validators.required, Validators.minLength(3)]]
  });
  pos = "right";
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

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    public businessService: BusinessService,
    public productorService: ProductorService,
    private router: Router) { }

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

  btnrecovery() {
    const { actual, password, repeatPassword } = this.formData.value;
    this.authService.modifyPassword(password, repeatPassword, actual).subscribe({
      next: resp => {
        if (resp.status) {
          Swal.fire({
            title: "Cambio de contraseña",
            text: "La contraseña fue cambiada exitosamente",
            icon: "success",
          })
          this.router.navigate(['/mantenedor/home']);
        }
        else {
          Swal.fire({
            title: "Validar información",
            text: resp.msg,
            icon: "error",
          });
          this.formData.reset();
        }
      },
    error: err => {
      Swal.fire({
        title: 'Formato inválido',
        text: 'Contraseña debe contener al menos 8 caracteres',
        icon: 'error'
      })
    }
    });
  }

  displayModifyPassword() {
    if (this.pos == "right") {
      this.pos = "down";
    } else {
      this.pos = "right";
    }
  }
}
