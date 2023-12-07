import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BusinessService } from '../../../../core/services/business.service';
@Component({
  selector: 'app-mantainer-users',
  templateUrl: './mantainer-users.component.html',
  styleUrls: ['./mantainer-users.component.css']
})
export class MantainerUsersComponent implements OnInit {
  verifyEmailMW = (control: FormControl) => {
    const email = control.value.toLowerCase().trim();

    if (!email) {
      return null;
    }
    let user;
    if (this.dbTmp.length > 0) {
      user = this.dbTmp.find(r => r.EMAIL.toLowerCase().trim() == email);
    } else {
      user = this.listUser.find(r => r.EMAIL.toLowerCase().trim() === email);
    }
    if (user && user.ID != this.userForm.value.ID) {
      return { used: true };  // el código se encuentra en el arreglo, hay errores
    } else {
      return null;  // el código NO se encuentra en el arreglo, no hay error
    }
  };

  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
  showErrorEmail = false;
  business: any[] = [];
  selectedBusiness!: any[];
  listUser: any[] = [];
  listRoles: any[] = [];
  isEdit = false;
  saving = false;
  userForm = this.fb.group({
    ID: [],
    FIRST_NAME: ['', [Validators.required]],
    LAST_NAME: ['', [Validators.required]],
    EMAIL: ['', [Validators.required, Validators.email, this.verifyEmailMW]],
    ROL: [[], [Validators.required, Validators.min(1)]],
    PHONE: ['', [Validators.required, Validators.pattern('^[0-9]{7,12}$')]],
    PHONE_OFFICE: ['', [Validators.required, Validators.pattern('^[0-9]{7,12}$')]],
    POSITION: ['', [Validators.required, Validators.min(1)]],
    BUSINESS: [[], [Validators.required]]
  });
  dbTmp: any[] = [];
  constructor(private authService: AuthService,
    private businesService: BusinessService,
    private fb: FormBuilder) { }
  ngOnInit(): void {
    this.loadUsers();
    this.loadBusiness();
    this.loadRoles();
  }
  loadBusiness() {
    this.businesService.getAllBusiness().subscribe(r => {
      if (r.status) {
        this.business = r.status;
        this.business.map(r => {
          r.view_name = `${r.CODE_BUSINESS} | ${r.NAME}`;
        });
      }
    });
  }
  filter(target: any) {
    const value = target.value?.toLowerCase().trim();
    this.pos = 1;
    if (target.value != '') {
      if (this.dbTmp.length > 0) {
        this.listUser = this.dbTmp;
      }
      this.cant = 1;
      this.db = this.listUser.filter(r => {
        const name = `${r.FIRST_NAME?.toLowerCase()} ${r.LAST_NAME?.toLowerCase()}`;
        const tmp: any[] = r.BUSINESS.filter((b: any) => {
          return b.NAME.toLowerCase().indexOf(value) > -1;
        });
        if (tmp.length > 0 || r.FIRST_NAME?.toLowerCase().indexOf(value) > -1 || r.LAST_NAME?.toLowerCase().indexOf(value) > -1 || r.PHONE?.toLowerCase().indexOf(value) > -1 || r.ROL_NAME?.toLowerCase().indexOf(value) > -1 || r.EMAIL?.toLowerCase().indexOf(value) > -1 || r.PHONE_OFFICE?.toLowerCase().indexOf(value) > -1 || r.POSITION?.toLowerCase().indexOf(value) > -1 || name.indexOf(value) > -1) return r;
      });
      if (this.dbTmp.length == 0) {
        this.dbTmp = this.listUser;
      }
      this.listUser = this.db;
      this.db = this.db.splice(0, 10);
      this.cant = Math.ceil(this.listUser.length / 10) || 1;
      return;
    }
    if (this.dbTmp.length > 0) {
      this.listUser = this.dbTmp;
    }
    this.db = this.listUser.slice(0, 10);
    this.cant = (Math.ceil(this.listUser.length / 10) || 1);
  }
  loadRoles() {
    this.authService.getRoles.subscribe(r => {
      if (r.status) {
        this.listRoles = r.data;
        this.listRoles.map(r => {
          r.view_name = `${r.NAME}`;
        });
      }
    });
  }
  loadUsers() {
    this.listUser = [];
    this.dbTmp = [];
    Swal.fire({
      title: 'Cargando Datos',
      text: 'Se está recuperando datos',
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    (document.getElementById('inp_filter') as HTMLInputElement).value = '';
    this.authService.getUsers.subscribe(r => {
      if (r.status) {
        this.listUser = r.data;
        this.dbTmp = r.data;
        this.cant = Math.ceil(this.listUser.length / 10) || 1;
        this.db = this.listUser.slice(0, 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
        Swal.close();
      }
    });
  }
  clearFrom() {
    this.userForm.reset({ ROL: null, EMAIL: '' });
  }

  showBusiness(e: any) {
    let tmp: any = [];
    e.BUSINESS.forEach((b: any) => {
      tmp.push(b.NAME.trim());
    });
    return tmp.join(', ');
  }

  showRoles(e: any) {
      let tmp: any = [];
    e.ROLES.forEach((b: any) => {
      tmp.push(b.ROL_NAME.trim());
    });
    return tmp.join(', ');
  }

  showName(id: any) {
    const b = this.business.find(r => r.ID == id);
    return `${b.CODE_BUSINESS} | ${b.NAME}`;
  }

  showRol(id: any) {
    const b = this.listRoles.find(r => r.ID == id);
    return `${b.NAME}`;
  }

  selectUser(id: number) {
    this.isEdit = true;
    const user = this.db.find(r => r.ID == id);
    this.userForm.controls['ID'].setValue(user.ID);
    this.userForm.controls['FIRST_NAME'].setValue(user.FIRST_NAME);
    this.userForm.controls['LAST_NAME'].setValue(user.LAST_NAME);
    this.userForm.controls['EMAIL'].setValue(user.EMAIL);
    this.userForm.controls['PHONE'].setValue(user.PHONE);
    this.userForm.controls['PHONE_OFFICE'].setValue(user.PHONE_OFFICE);
    this.userForm.controls['POSITION'].setValue(user.POSITION);
    const tmpo = user.ROLES?.map((r: any) => r.ID_ROL);
    this.userForm.controls['ROL'].setValue(tmpo);
    const tmp = user.BUSINESS?.map((r: any) => r.ID_BUSINESS);
    this.userForm.controls['BUSINESS'].setValue(tmp);
  }
  deleteUser(id: number) {
    const user = this.db.find(r => r.ID == id);
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
            });
            this.loadUsers();
            this.pos = 1;
          }
        });
      }
    });
  }
  verifyEmail() {
    const email = this.userForm.value.EMAIL?.toLowerCase().trim();
    const user = this.listUser.find(r => r.EMAIL.toLowerCase().trim() == email);
    if (!user || user.ID == this.userForm.value.ID) {
      this.showErrorEmail = true;
      this.userForm.controls['EMAIL'].setErrors({ used: true });
      return false;
    }
    this.showErrorEmail = false;
    return false;
  }
  verifyEmail2(e: any) {
    if (e?.notUnique) {
      return true;
    }
    return false;
  }
  saveForm() {
    Swal.fire({
      icon: 'info',
      text: 'Guardando datos',
      allowEnterKey: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.saving = true;
    if (this.userForm.invalid) return;
    if (this.isEdit) {
      this.authService.updateUser(this.userForm.value).subscribe({
        next: r => {
          Swal.close();
          if (r.status) {
            this.clearFrom();
            document.getElementById('btnCloseModal')?.click();
            Swal.fire({
              icon: 'success',
              text: r.msg
            });
            this.loadUsers();
            this.pos = 1;
            this.saving = false;
          }
        },
        error: r => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            text: 'Algo salió mal'
          });
        }
      });
    } else {
      this.authService.registerUser(this.userForm.value).subscribe({
        next: r => {
          Swal.close();
          if (r.status) {
            this.clearFrom();
            document.getElementById('btnCloseModal')?.click();
            Swal.fire({
              icon: 'success',
              text: r.msg
            });
            this.loadUsers();
            this.pos = 1;
            this.saving = false;
          } else {
            Swal.close();
            Swal.fire({
              icon: 'warning',
              text: r.msg
            });
            this.saving = false;
          }
        },
        error: r => {
          Swal.close();
          Swal.fire({
            icon: 'error',
            text: 'Algo salió mal'
          });
        }
      }
      );
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
  visiblePageNumbers() {
    const totalPages = this.setArrayFromNumber().length;
    const visiblePages = [];
  
    if (totalPages <= 15) {
      // Si hay 20 o menos páginas, mostrar todas
      for (let i = 0; i < totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Calcular las páginas visibles alrededor de la página actual
      let startPage = Math.max(0, this.pos - Math.floor(15 / 2));
      let endPage = Math.min(totalPages - 1, startPage + 14);
  
      // Ajustar el cálculo si estamos cerca del final
      if (endPage - startPage + 1 < 15) {
        endPage = totalPages - 1;
        startPage = Math.max(0, endPage - 14);
      }
  
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }
    }
  
    return visiblePages;
  }
}
