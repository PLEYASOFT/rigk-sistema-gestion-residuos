import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/core/services/business.service';
import Swal from 'sweetalert2';
import {  validate, clean, format, getCheckDigit } from 'rut.js'
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-maintainer-establishment',
  templateUrl: './maintainer-establishment.component.html',
  styleUrls: ['./maintainer-establishment.component.css']
})
export class MaintainerEstablishmentComponent implements OnInit {

  business: any[];
  selectedBusiness!: any[];
  listUser: any[] = [];
  listRoles: any[] = [];
  isEdit = false;

 
  id = '';
  index = 0;
  id_business: any [] = [];
  name_business: string [] = [];
  loc_address: string [] = [];

  userData: any | null;

  userForm = this.fb.group({
    ID: [],
    FIRST_NAME: [],
    LAST_NAME: [],
    EMAIL: [],
    ROL: [0],
    PASSWORD: [],
    PHONE: [],
    PHONE_OFFICE: [],
    POSITION: [],
    BUSINESS: []
  })

  constructor(private authService: AuthService,
    private businesService: BusinessService,
    private fb: FormBuilder) {
    this.business = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
  }

    

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllBusiness();
  }

  getAllBusiness() {
    this.id_business= [];
    this.name_business= [];
    this.loc_address= [];
    this.businesService.getAllBusiness().subscribe({
      next: resp => {
        if (resp.status) {
          for(let i = 0; i < resp.status.length; i++)
          {
            this.id_business.push(resp.status[i].ID) ;
            this.name_business.push(resp.status[i].NAME) ;
            this.loc_address.push(resp.status[i].LOC_ADDRESS) ;
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

  loadBusiness() {
    this.businesService.getAllBusiness().subscribe(r => {
      console.log(r)
      if (r.status) {
        this.business = r.status;
        this.business.map(r => {
          r.view_name = `${r.CODE_BUSINESS} | ${r.NAME}`
        })
      }
    })
  }

  loadRoles() {
    this.authService.getRoles.subscribe(r => {
      if (r.status) {
        this.listRoles = r.data;
      }
    })
  }
  loadUsers() {
    this.authService.getUsers.subscribe(r => {
      if (r.status) {
        this.listUser = r.data;
        this.cant = Math.ceil(this.listUser.length / 10);
        this.db = this.listUser.slice(0, 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
      }
    })
  }

  selectUser(id: number) {
    this.isEdit = true;
    const user = this.listUser.find(r => r.ID == id);
    this.userForm.controls['ID'].setValue(user.ID);
    this.userForm.controls['FIRST_NAME'].setValue(user.FIRST_NAME);
    this.userForm.controls['LAST_NAME'].setValue(user.LAST_NAME);
    this.userForm.controls['EMAIL'].setValue(user.EMAIL);
    this.userForm.controls['PHONE'].setValue(user.PHONE);
    this.userForm.controls['PHONE_OFFICE'].setValue(user.PHONE_OFFICE);
    this.userForm.controls['POSITION'].setValue(user.POSITION);
    this.userForm.controls['ROL'].setValue(user.ID_ROL);
    const tmp = user.BUSINESS?.map((r: any) => r.ID_BUSINESS);
    this.userForm.controls['BUSINESS'].setValue(tmp);
  }

  deleteUser(id: number) {
    const user = this.listUser.find(r => r.ID == id);
    Swal.fire({
      icon: 'question',
      text: `Estas seguro de eliminar al usuario ${user.FIRST_NAME} ${user.LAST_NAME}`,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then(btn => {
      if (btn.isConfirmed) {
        this.authService.deleteUser(user.ID).subscribe(r => {
          if (r.status) {
            Swal.fire({
              icon: 'success',
              text: r.msg
            })
            this.loadUsers();
          }
        })
      }
    })
  }

  saveForm() {

    if (this.isEdit) {
      this.authService.updateUser(this.userForm.value).subscribe(r => {
        if (r.status) {
          document.getElementById('btnCloseModal')?.click();
          Swal.fire({
            icon: 'success',
            text: r.msg
          })
          this.loadUsers();
        }
      });
    } else {
      this.authService.registerUser(this.userForm.value).subscribe(r => {
        if (r.status) {
          document.getElementById('btnCloseModal')?.click();
          Swal.fire({
            icon: 'success',
            text: r.msg
          });
          this.loadUsers();
        }
      });
    }
  }
  pos = 1;
  db: any[] = [];
  cant = 0;
  pagTo(i: number) {
    this.pos = i + 1;
    this.db = this.listUser.slice((i * 10), (i + 1) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;
  }
  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.listUser.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;
  }
  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.listUser.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;
  }
  setArrayFromNumber() {
    return new Array(this.cant);
  }
}
