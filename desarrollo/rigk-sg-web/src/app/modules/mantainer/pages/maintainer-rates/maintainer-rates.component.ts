import { ParseError } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { validate } from 'rut.js';
import { RatesTsService } from 'src/app/core/services/rates.ts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maintainer-rates',
  templateUrl: './maintainer-rates.component.html',
  styleUrls: ['./maintainer-rates.component.css']
})
export class MaintainerRatesComponent implements OnInit {

  list: any[] = [];
  pos = 1;
  db: any[] = [];
  cant = 0;

  formData: any;
  existingCode: any = '';
  popupVisible = false;
  popupModify = false;
  id = '';
  index = 0;
  year: any[] = [];
  type: any[] = [];
  price: any[] = [];
  isok:boolean=false;
  
  
  userData: any | null;
  defaultYear:any =  [];
  selectedYear: any;
  
  ratesForm = this.fb.group({
    year: ['0',[Validators.required, Validators.min(2021)]],
    type_1: ['',[Validators.required, Validators.min(0)]],
    type_2: ['',[Validators.required, Validators.min(0)]],
    type_3: ['',[Validators.required, Validators.min(0)]],
    type_4: ['',[Validators.required, Validators.min(0)]],
  })
  constructor(private fb: FormBuilder,
    public ratesTsService: RatesTsService) { }
    
    
    modify(rate:any) {
      this.isEditing = true;
      this.ratesForm.controls['year'].setValue(rate.year);
      this.selectedYear = rate.year;
      const r1 = parseFloat(rate.data.findIndex((e:any)=>e.type == 1));
      const r2 = parseFloat(rate.data.findIndex((e:any)=>e.type == 2));
      const r3 = parseFloat(rate.data.findIndex((e:any)=>e.type == 3));
      const r4 = parseFloat(rate.data.findIndex((e:any)=>e.type == 4));
      const a1 = rate.data[r1].price;
      const b1 = parseFloat(a1).toFixed(2).replace(".",",");
      const a2 = rate.data[r2].price;
      const b2 = parseFloat(a2).toFixed(2).replace(".",",");
      const a3 = rate.data[r3].price;
      const b3 = parseFloat(a3).toFixed(2).replace(".",",");
      const a4 = rate.data[r4].price;
      const b4 = parseFloat(a4).toFixed(2).replace(".",",");
      this.ratesForm.controls['type_1'].setValue(b1);//rate.data[r1].price
      this.ratesForm.controls['type_2'].setValue(b2);//rate.data[r2].price
      this.ratesForm.controls['type_3'].setValue(b3);//rate.data[r3].price
      this.ratesForm.controls['type_4'].setValue(b4);//rate.data[r4].price      
    }
    
  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllRates();

    this.formData = this.fb.group({
      year: ['', [Validators.required]],
      type: ['', [Validators.required]],
      price: ['', [Validators.required]]
    });

    for (let i = 2021; i <= (new Date()).getFullYear()+1; i++) {
      this.defaultYear.push(i); 
    }
  }
  isEditing = false;
  saveForm() {
    if(this.ratesForm.invalid) {
      Swal.fire({
        icon: 'warning',
        text:'Todas las tarifas son requeridas y deben ser valores positivo'
      });
      return;
    }
    const pattern = /^[0-9]+(,[0-9]+)?$/;
    if(!pattern.test(this.ratesForm.value.type_1!))
    {
      Swal.fire({
        icon: 'warning',
        text:'Separador de miles con punto y separador de decimales con coma. Máximo 2 decimales'
      });
      return; 
    }
    if(this.isEditing) {
      this.ratesTsService.updateRatesByYear(this.ratesForm.value).subscribe({
        next: r=> {
          if(r.status){
            this.getAllRates();
            document.getElementById('closeModallll')?.click();
            document.getElementById('closeModallll2')?.click();
          } else {
            document.getElementById('closeModallll')?.click();
            document.getElementById('closeModallll2')?.click();
            Swal.fire({
              icon: 'error',
              text: r.msg + ""
            })
          }
        }
      })
    } else {
      this.ratesTsService.save(this.ratesForm.value).subscribe({
        next: r=> {
          if(r.status){
            this.getAllRates();
            document.getElementById('closeModallll')?.click();
          } else {
            Swal.fire({
              icon: 'error',
              text: r.msg
            })
          }
        }
      });
    }

  }
  
  
  dbRates: any[]=[]
  rates:{year:NumberConstructor, data:any}[]=[];
  getAllRates() {
    this.rates = [];
    this.dbRates = [];
    this.year = [];
    this.type = [];
    this.price = [];
    this.ratesTsService.getAllRates().subscribe({
      next: resp => {
        if(resp.status){
          this.dbRates = resp.data
          this.dbRates.forEach(r => {
            const index = this.rates.findIndex((e:any)=>e.year == r.year);
            if(index > -1) {
              this.rates[index].data.push(r);
            } else {
              this.rates.push({year: r.year, data:[r]});
            }
          });
          if(this.rates.length == (new Date()).getFullYear() - 2021+2) {
            this.isok = true;
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
  getYear(val:any){
    return val.year;
  }

  getPrice(val:any,type:number){
    const r = val.data.findIndex((e:any)=>e.type == type);
    return val.data[r].price || 0;
  }
  

  btnAddBusiness() {
    const { name_business, rut, loc_address, phone,
      email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business, giro } = this.formData.value;

    if (this.formData.invalid) {
      Swal.fire({
        title: "Validar información",
        text: 'Debe completar todos los campos',
        icon: "error",
      });
      this.getAllRates();
      return;
    }
  }
  
  btnDeleteBusiness(id_business: any) {
    Swal.fire({
      title: '¿Estás seguro que quieres eliminar la empresa?',
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        // this.businessService.deleteBusiness(id_business).subscribe({
        //   next: resp => {
        //     if (resp.status) {
        //       Swal.fire({
        //         title: "Empresa Eliminada",
        //         text: "",
        //         icon: "error",
        //       })
        //       this.getAllRates();
        //       this.pagTo(0);
        //     }
        //     else {
        //       Swal.fire({
        //         title: "Validar información",
        //         text: resp.msg,
        //         icon: "error",
        //       });
        //     }
        //   },
        //   error: err => {
        //     Swal.fire({
        //       title: 'Formato inválido',
        //       text: '',
        //       icon: 'error'
        //     })
        //   }
        // });
      }
    })
  }

  btnUpdateBusiness(id_business: any) {
    const { name_business, rut, loc_address, phone,
      email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business, giro } = this.formData.value;

    if (this.formData.invalid) {
      Swal.fire({
        title: "Validar información",
        text: 'Debe completar todos los campos',
        icon: "error",
      });
      return;
    }

    this.ratesTsService.updateRates(this.id, this.price).subscribe({
      next: resp => {
        if (resp.status) {
          Swal.fire({
            title: "Empresa Modificada",
            text: "",
            icon: "success",
          })
          this.formData.reset();
          this.popupModify = false;
          this.getAllRates();
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

  // verifyCode = (control: FormControl) => {
  //   const code_business = control.value;

  //   if (!code_business) {
  //     return null;
  //   }
  //   const lowerCaseCodes = this.code_business.map(code => code.toLowerCase());
  //   if (lowerCaseCodes.includes(code_business.toLowerCase()) &&
  //     (code_business.toLowerCase() !== this.existingCode.toLowerCase())) {
  //     return { code_business: true };  // el código se encuentra en el arreglo, hay errores
  //   } else {
  //     return null;  // el código NO se encuentra en el arreglo, no hay error
  //   }
  // };

  pagTo(i: number) {
    this.pos = i + 1;
    this.db = this.list.slice((i * 10), (i + 1) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.list.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.list.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  setArrayFromNumber() {
    return new Array(this.cant);
  }

  filterrates(target: any) {
    const value = target.value?.toLowerCase();
    this.pos = 1;
    const listIndex:any = []
    if (target.value != '') {
      this.cant = 1;
      this.db = this.list.filter(r => {
        if (r.PRICE?.toLowerCase().indexOf(value)){
            listIndex.push(r);
          } 
      });
      this.db = listIndex.slice(0, 10);
      this.cant = Math.ceil(listIndex.length / 10);
      return this.db;
    }
    this.db = this.list.slice(0, 10);
    this.cant = Math.ceil(this.list.length / 10);
    return this.db;
  }
  filter(target: any) {
    const value = target.value?.toLowerCase();
    this.pos = 1;
    const listIndex:any = []
    if (target.value != '') {
      this.cant = 1;
      this.db = this.dbRates.filter(r => {
        if (r.YEAR?.toLowerCase().indexOf(value) != undefined ){
            listIndex.push(r);
          } 
      });
      this.db = listIndex.slice(0, 10);
      this.cant = Math.ceil(listIndex.length / 10);
      return this.db;
    }
    this.db = this.dbRates.slice(0, 10);
    this.cant = Math.ceil(this.dbRates.length / 10);
    return this.db;
  }
  // filter(searchTerm: string) {
  //   if (!searchTerm) {
  //     this.defaultYear= this.rates;
  //   } else {
  //     this.defaultYear = this.rates.filter(rate => this.getYear(rate).toString().includes(searchTerm));
  //   }
  // }

}
