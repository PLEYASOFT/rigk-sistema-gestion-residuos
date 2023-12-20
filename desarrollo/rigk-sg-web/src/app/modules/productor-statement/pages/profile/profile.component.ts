import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any | null;
  pos = "right";
  horaIngreso = new Date();
  db: any[] = [];
  business_user: any[] = [];
  index: number = 0;
  file: any;
  posP = 1;
  cant: number = 0;
  allBusiness: any[] = [];
  filteredForm: any[] = [];

  formData: FormGroup = this.fb.group({
    actual: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    repeatPassword: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private productorServices: ProductorService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadStatements();
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.horaIngreso = new Date(sessionStorage.getItem('horaIngreso')!);
  }

  getBusiness() {
    this.productorServices.businessUserDJ(this.userData.ID).subscribe(r => {
      if (r.status) {
        this.business_user = r.data;
      }
    });
  }

  loadStatements() {
    const idUser = JSON.parse(sessionStorage.getItem('user')!).ID;
    this.productorServices.businessUserDJ(idUser).subscribe(r => {
      this.allBusiness = (r.data as any).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
      this.cant = Math.ceil(this.allBusiness.length / 10);
      this.db = this.allBusiness.slice((this.posP - 1) * 10, this.posP * 10).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
    })
  }

  reset() {
    this.loadStatements();
  }

  pagTo(i: number) {
    this.posP = i + 1;
    this.db = this.allBusiness.slice((i * 10), (i + 1) * 10).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
  }

  next() {
    if (this.posP >= this.cant) return;
    this.posP++;
    this.db = this.allBusiness.slice((this.posP - 1) * 10, (this.posP) * 10).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
  }

  previus() {
    if (this.posP - 1 <= 0 || this.posP >= this.cant + 1) return;
    this.posP = this.posP - 1;
    this.db = this.allBusiness.slice((this.posP - 1) * 10, (this.posP) * 10).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
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
      let startPage = Math.max(0, this.posP - Math.floor(15 / 2));
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
          this.router.navigate(['/productor/home']);
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

  pos2 = "right"
  displayModifyPassword2() {
    if (this.pos2 == "right") {
      this.pos2 = "down";
    } else {
      this.pos2 = "right";
    }
  }

  downloadTerminos(idEmpresa: string) {
    const idUsuario = this.userData.ID;
    this.productorServices.downloadPdfFirma(idEmpresa, idUsuario).subscribe({
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

  adjuntar(idEmpresa: string) {
    const idUsuario = this.userData.ID;
    var input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.onchange = (e) => {
      var target = e.target as HTMLInputElement;
      let _file = target.files![0];
      if (_file && _file.type === 'application/pdf' && _file.size / 1000 <= 1000) {
        this.file = _file;
        this.productorServices.uploadPDFTerminos(_file, idEmpresa, idUsuario).subscribe({
          next: (res) => {
            if (res.status) {
              this.reset();
            }
          }
        });
      } else {
        Swal.fire({
          icon: 'info',
          text: 'El archivo debe ser PDF y debe pesar menos de 1MB'
        })
      }
    }
    document.body.appendChild(input);
    input.click();
  }

  deleteDJ(idEmpresa: string) {
    const idUsuario = this.userData.ID;
    Swal.fire({
      title: '¿Esta seguro de eliminar la declaración jurada?',
      showDenyButton: true,
      confirmButtonText: 'Aceptar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.productorServices.deleteDJ(idEmpresa, idUsuario).subscribe({
          next: resp => {
            if (resp.status) {
              Swal.fire({
                title: "Declaración Eliminada",
                text: "",
                icon: "error",
              });
              this.reset();
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
}
