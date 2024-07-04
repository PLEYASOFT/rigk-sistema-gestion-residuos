import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BusinessService } from '../../../../core/services/business.service';
import { ProductorService } from 'src/app/core/services/productor.service';
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

  allBusinessUser:any = []
  posP = 1;
  emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
  showErrorEmail = false;
  business: any[] = [];
  selectedBusiness!: any[];
  listUser: any[] = [];
  dbTmp: any[] = [];
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
  constructor(private authService: AuthService,
    private businesService: BusinessService,
    private productorService: ProductorService,
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
        this.business.sort((a, b) => a.view_name.localeCompare(b.view_name));
      }
    });
  }
  filter(target: any) {
    const value = target.value?.toLowerCase();
    this.pos = 1;
    const listIndex:any = [];

    if (target.value != '') {
      this.cant = 1;

      this.dbTmp = this.listUser.filter(user => {
        const isMatch = user.FIRST_NAME?.toLowerCase().indexOf(value) > -1 ||
                        user.LAST_NAME?.toLowerCase().indexOf(value) > -1 ||
                        user.PHONE?.toLowerCase().indexOf(value) > -1 ||
                        user.ROL_NAME?.toLowerCase().indexOf(value) > -1 ||
                        user.EMAIL?.toLowerCase().indexOf(value) > -1 ||
                        user.PHONE_OFFICE?.toLowerCase().indexOf(value) > -1 ||
                        user.POSITION?.toLowerCase().indexOf(value) > -1;

        const isBusinessMatch = user.BUSINESS?.some((business:any) => 
            business.NAME?.toLowerCase().indexOf(value) > -1
        );

        if (isMatch || isBusinessMatch) {
            listIndex.push(user);
        }
      });
      this.dbTmp =  listIndex;
      this.db = listIndex.slice(0, 10);
      this.cant = Math.ceil(listIndex.length / 10);
      return this.db;
    }
    this.dbTmp = this.listUser;
    this.db = this.listUser.slice(0, 10);
    this.cant = Math.ceil(this.listUser.length / 10);
    return this.db;
}

  loadRoles() {
    this.authService.getRoles.subscribe(r => {
      if (r.status) {
        this.listRoles = r.data;
        this.listRoles.map(r => {
          r.view_name = `${r.NAME}`;
        });
        this.listRoles.sort((a, b) => a.view_name.localeCompare(b.view_name));
      }
    });
  }
  loadUsers() {
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
        this.cant = Math.ceil(this.listUser.length / 10);
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
  
  setArrayFromNumber() {
    return new Array(this.cant);
  }
  
  pos = 1;
  db: any[] = [];
  cant = 0;
  pagTo(i: number) {
    this.pos = i + 1;
    this.db = this.dbTmp.slice((i * 10), (i + 1) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.dbTmp.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.dbTmp.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
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

  hasProductorRole(): boolean {
    const roles = this.userForm.value.ROL as number[] | null | undefined;
    return Array.isArray(roles) && roles.includes(9);
  }

  downloadTerminos(idEmpresa: string) {
    const idUsuario = this.userForm.value.ID
    this.productorService.downloadPdfFirma(idEmpresa, idUsuario).subscribe({
      next: (r) => {
        if (r) {
          const file = new Blob([r], { type: 'application/pdf' });
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(file);
          link.download = "Declaración Jurada Firmada";
          document.body.appendChild(link);
          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          link.remove();
          window.URL.revokeObjectURL(link.href);
        }
      }
    })
  }

  loadDJ(){
    const idUser = this.userForm.value.ID;
    this.productorService.businessUserDJ(idUser).subscribe(r => {
      this.allBusinessUser = (r.data as any).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
      this.cant2 = Math.ceil(this.allBusinessUser.length / 10);
      this.db2 = this.allBusinessUser.slice((this.posP - 1) * 10, this.posP * 10).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
    })
  }


  db2: any[] = [];
  cant2 = 0;
  pagTo2(i: number) {
    this.posP = i + 1;
    this.db2 = this.allBusinessUser.slice((i * 10), (i + 1) * 10).sort((a:any, b:any) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;
  }
  next2() {
    if (this.posP >= this.cant2) return;
    this.posP++;
    this.db2 = this.allBusinessUser.slice((this.posP - 1) * 10, (this.posP) * 10).sort((a:any, b:any) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;
  }
  previus2() {
    if (this.posP - 1 <= 0 || this.posP >= this.cant2 + 1) return;
    this.posP = this.posP - 1;
    this.db2 = this.allBusinessUser.slice((this.posP - 1) * 10, (this.posP) * 10).sort((a:any, b:any) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;
  }
  setArrayFromNumber2() {
    return new Array(this.cant2);
  }
  visiblePageNumbers2() {
    const totalPages = this.setArrayFromNumber2().length;
    const visiblePages = [];
    if (totalPages <= 10) {
      // Si hay 20 o menos páginas, mostrar todas
      for (let i = 0; i < totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Calcular las páginas visibles alrededor de la página actual
      let startPage = Math.max(0, this.posP - Math.floor(10 / 2));
      let endPage = Math.min(totalPages - 1, startPage + 9);
      // Ajustar el cálculo si estamos cerca del final
      if (endPage - startPage + 1 < 10) {
        endPage = totalPages - 1;
        startPage = Math.max(0, endPage - 9);
      }
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }
    }
    return visiblePages;
  }
}
