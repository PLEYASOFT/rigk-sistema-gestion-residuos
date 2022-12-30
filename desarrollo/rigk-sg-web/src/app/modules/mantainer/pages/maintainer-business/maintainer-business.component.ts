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
    id_business: ['', [Validators.required]],
    name_business : ['', [Validators.required]],
    rut : ['', [Validators.required, Validators.minLength(3)]],
    loc_address : ['', [Validators.required, Validators.minLength(3)]],
    phone  : ['', [Validators.required]],
    email : ['', [Validators.required, Validators.minLength(3)]],
    am_first_name  : ['', [Validators.required, Validators.minLength(3)]],
    am_last_name   : ['', [Validators.required]],
    invoice_name  : ['', [Validators.required, Validators.minLength(3)]],
    invoice_email   : ['', [Validators.required, Validators.minLength(3)]],
    invoice_phone    : ['', [Validators.required, Validators.minLength(3)]]
  });
  popupVisible = false;
  popupModify = false;
  id = '';
  index = 0;
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

  userData: any | null;

  constructor(private fb: FormBuilder,
    public businessService: BusinessService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllBusiness();
  }

  getAllBusiness() {
    this.id_business= [];
    this.name_business= [];
    this.rut= [];
    this.loc_address= [];
    this.phone= [];
    this.email= [];
    this.am_first_name= [];
    this.am_last_name= [];
    this.invoice_name= [];
    this.invoice_email= [];
    this.invoice_phone= [];
    this.businessService.getAllBusiness().subscribe({
      next: resp => {
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

  btnAddBusiness() {
    
    const { name_business, rut, loc_address,phone,  
    email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone} = this.formData.value;
    
    console.log(this.formData.value)
    this.businessService.postBusiness(name_business, rut, loc_address, phone, email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone).subscribe({
      next: resp => {
        console.log(resp)
        if (resp.status) {
          Swal.fire({
            title: "Empresa agregada",
            text: "La contraseña fue cambiada exitosamente",
            icon: "success",
          })
          this.popupVisible=false;
          this.getAllBusiness();
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


  btnDeleteBusiness(id_business:any) {
    
    Swal.fire({
      title: '¿Estás seguro que quieres eliminar la empresa?',
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,}).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.businessService.deleteBusiness(id_business).subscribe({
            next: resp => {
              console.log(resp)
              
              if (resp.status) {
                Swal.fire({
                  title: "Empresa Eliminada",
                  text: "",
                  icon: "error",
                })
                this.getAllBusiness();
                //this.router.navigate(['/mantenedor/home']);
              }
              else {
                Swal.fire({
                  title: "Validar información",
                  text: resp.msg,
                  icon: "error",
                });
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
      })
  }

  btnUpdateBusiness(id_business:any) {
    
    const { name_business, rut, loc_address,phone,  
    email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone} = this.formData.value;
    
    console.log(this.formData.value)
    this.businessService.updateBusiness(id_business,name_business, rut, loc_address, phone, email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone).subscribe({
      next: resp => {
        console.log(resp)
        if (resp.status) {
          Swal.fire({
            title: "Empresa Modificada",
            text: "La contraseña fue cambiada exitosamente",
            icon: "success",
          })
          this.popupModify=false;
          this.getAllBusiness();
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
}
