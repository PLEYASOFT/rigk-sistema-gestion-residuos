import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { BusinessService } from '../../../../core/services/business.service';

@Component({
  selector: 'app-mantainer-users',
  templateUrl: './mantainer-users.component.html',
  styleUrls: ['./mantainer-users.component.css']
})
export class MantainerUsersComponent implements OnInit {

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  business: any[] = [];
  selectedBusiness!: any[];
  listUser: any[] = [];
  listRoles: any[] = [];
  isEdit = false;

  userForm = this.fb.group({
    ID: [],
    FIRST_NAME: ['', [Validators.required]],
    LAST_NAME: ['', [Validators.required]],
    EMAIL: ['', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]],
    ROL: [0, [Validators.required, Validators.min(1)]],
    PHONE: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    PHONE_OFFICE: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    POSITION: ['', [Validators.required]],
    BUSINESS: [[], [Validators.required]]
  })

  constructor(private authService: AuthService,
    private businesService: BusinessService,
    private fb: FormBuilder) { }


  ngOnInit(): void {
    Swal.fire({
      title: 'Cargando Datos',
      text: 'Se está recuperando datos',
      timerProgressBar: true,
      showConfirmButton: false
    });
    Swal.showLoading();
    this.loadUsers();
    this.loadBusiness();
    this.loadRoles();
  }

  loadBusiness() {
    this.businesService.getAllBusiness().subscribe(r => {
      if (r.status) {
        this.business = r.status;
        this.business.map(r => {
          r.view_name = `${r.CODE_BUSINESS} | ${r.NAME}`
        })
      }
    })
  }

  filter(target: any) {
    const value = target.value?.toLowerCase();
    this.pos = 1;
    if(target.value != ''){
      this.cant = 1;
      this.db = this.listUser.filter(r=>{
        if(r.FIRST_NAME?.toLowerCase() == value || r.LAST_NAME?.toLowerCase() == value || r.PHONE?.toLowerCase() == value || r.ROL_NAME?.toLowerCase() == value || r.EMAIL?.toLowerCase() ==value || r.PHONE_OFFICE?.toLowerCase() == value || r.POSITION?.toLowerCase() == value) return r;
      });
      return;
    }
    this.db = this.listUser.slice(0,10);
    this.cant = Math.ceil(this.listUser.length / 10);    
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
        Swal.close();
      }
    })
  }

  showBusiness(e:any[]) {
    let tmp:any = [];
    e.forEach(b => {
      tmp.push(b.NAME)
    });
    return tmp.join(', ');
  }
  showName(id: any){
    const b = this.business.find(r=>r.ID == id);
    return `${b.CODE_BUSINESS} | ${b.NAME}`
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
      text: `¿Estás seguro de eliminar al usuario ${user.FIRST_NAME} ${user.LAST_NAME}?`,
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
            this.pos = 1;
          }
        })
      }
    })
  }

  verifyEmail() {
    const email = this.userForm.value.EMAIL;
    const user = this.listUser.find(r => r.EMAIL == email);
    if (!user || user.ID == this.userForm.value.ID) return false;

    this.userForm.controls['EMAIL'].setErrors({ notUnique: true });
    return false;
  }

  verifyEmail2(e: any) {
    if (e?.notUnique) {
      return true;
    }
    return false;
  }
  saveForm() {
    if (this.userForm.invalid) return;

    if (this.isEdit) {
      this.authService.updateUser(this.userForm.value).subscribe(r => {
        if (r.status) {
          document.getElementById('btnCloseModal')?.click();
          Swal.fire({
            icon: 'success',
            text: r.msg
          })
          this.loadUsers();
          this.pos = 1;
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
          this.pos = 1;
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
