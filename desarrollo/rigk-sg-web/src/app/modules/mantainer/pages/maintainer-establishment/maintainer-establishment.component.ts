import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/core/services/business.service';
import Swal from 'sweetalert2';
import {  validate, clean, format, getCheckDigit } from 'rut.js'

@Component({
  selector: 'app-maintainer-establishment',
  templateUrl: './maintainer-establishment.component.html',
  styleUrls: ['./maintainer-establishment.component.css']
})
export class MaintainerEstablishmentComponent implements OnInit {

 
  formData: any;
  existingCode:any = '';
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
  code_business: any[] = [];
  giro: string[] = [];

  userData: any | null;

  constructor(private fb: FormBuilder,
    public businessService: BusinessService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllBusiness();

    this.formData = this.fb.group({
      code_business : ['', [Validators.required, this.verifyCode]], // Campo requerido
      name_business : ['', [Validators.required]], // Campo requerido
      rut : ['', [Validators.required, Validators.pattern('^[0-9]{1,2}[0-9]{3}[0-9]{3}-[0-9Kk]{1}$'),this.verifyRut] ], // Campo requerido y con formato de RUT
      loc_address : ['', [Validators.required]], // Campo requerido
      phone : ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]], // Campo requerido y con formato de número de teléfono
      email : ['', [Validators.required, Validators.email]], // Campo requerido y con formato de correo electrónico
      am_first_name : ['', [Validators.required]], // Campo requerido
      am_last_name : ['', [Validators.required]], // Campo requerido
      invoice_name : ['', [Validators.required]], // Campo requerido
      invoice_email : ['', [Validators.required, Validators.email]], // Campo requerido y con formato de correo electrónico
      invoice_phone : ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]], // Campo requerido y con formato de número de teléfono
      giro: ['', [Validators.required]]
    });
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
    this.code_business= [];
    this.giro= [];
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
            this.code_business.push(resp.status[i].CODE_BUSINESS);
            this.giro.push(resp.status[i].GIRO);
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
    email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business,giro} = this.formData.value;

    if (this.formData.invalid) {
      Swal.fire({
        title: "Validar información",
        text: 'Debe completar todos los campos',
        icon: "error",
      });
      this.getAllBusiness();
      return;
    }
    
    this.businessService.postBusiness(name_business, rut, loc_address, phone, email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business,giro).subscribe({
      next: resp => {
          if(resp.status ){
            Swal.fire({
              title: "Empresa agregada",
              text: "La empresa fue agregada exitosamente",
              icon: "success",
            })
            this.popupVisible=false;
            this.getAllBusiness();
            this.formData.reset();
          }
      },
    error: err => {
      Swal.fire({
        title: 'Error',
        text: 'Error al agregar la empresa',
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
        if (result.isConfirmed) {
          this.businessService.deleteBusiness(id_business).subscribe({
            next: resp => {
              if (resp.status) {
                Swal.fire({
                  title: "Empresa Eliminada",
                  text: "",
                  icon: "error",
                })
                this.getAllBusiness();
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
              text: '',
              icon: 'error'
            })
          }
          });
        } 
      })
  }

  btnUpdateBusiness(id_business:any) {
    
    const { name_business, rut, loc_address,phone,  
    email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business,giro} = this.formData.value;
    
    if (this.formData.invalid) {
      Swal.fire({
        title: "Validar información",
        text: 'Debe completar todos los campos',
        icon: "error",
      });
      return;
    }

    this.businessService.updateBusiness(id_business,name_business, rut, loc_address, phone, email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business,giro).subscribe({
      next: resp => {
        if (resp.status) {
          Swal.fire({
            title: "Empresa Modificada",
            text: "",
            icon: "success",
          })
          this.formData.reset();
          this.popupModify=false;
          this.getAllBusiness();
        }
      },
    error: err => {
      Swal.fire({
        title: 'Error',
        text: '',
        icon: 'error'
      })
    }
    });
  }

  verifyRut(control: FormControl) {
    const rut = control.value;
    if (validate(rut)) {
      return null;  // el RUT es válido, no hay errores
    } else {
      return { rut: true };  // el RUT es inválido, retorna un error
    }
  }

  verifyCode = (control: FormControl) => {
    const code_business = control.value;
    
    if (!code_business) {
      return null;
    }
    const lowerCaseCodes = this.code_business.map(code => code.toLowerCase()); 
    if (lowerCaseCodes.includes(code_business.toLowerCase())  && 
    ( code_business.toLowerCase() !== this.existingCode.toLowerCase())) {
      return { code_business: true };  // el código se encuentra en el arreglo, hay errores
    } else {
      return null;  // el código NO se encuentra en el arreglo, no hay error
    }
  };

  
}
