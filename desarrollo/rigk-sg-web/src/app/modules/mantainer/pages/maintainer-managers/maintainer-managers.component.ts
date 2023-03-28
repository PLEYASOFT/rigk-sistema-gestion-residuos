import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BusinessService } from '../../../../core/services/business.service';
import { EstablishmentService } from 'src/app/core/services/establishment.service';

@Component({
  selector: 'app-maintainer-managers',
  templateUrl: './maintainer-managers.component.html',
  styleUrls: ['./maintainer-managers.component.css']
})
export class MaintainerManagersComponent implements OnInit {

  listRegiones: any[] = [
    'Región de Arica y Parinacota',
    'Región de Tarapacá',
    'Región de Antofagasta',
    'Región de Atacama',
    'Región de Coquimbo',
    'Región de Valparaíso',
    'Región Metropolitana',
    'Región de O’Higgins',
    'Región del Maule',
    'Región del Ñuble',
    'Región del Biobío',
    'Región de La Araucanía',
    'Región de Los Ríos',
    'Región de Los Lagos',
    'Región de Aysén',
    'Región de Magallanes'
  ];

  listBusiness: any[] = [];
  pos = 1;
  db: any[] = [];
  cant = 0;

  establishmentStatus: any = [];
  pos2 = 1;
  db2: any[] = [];
  cant2 = 0;

  index: number = 0;

  userData: any | null;

  FIRST_NAME: any = [];
  REGION: any = "";
  userForm: any;

  direction = 'asc';
  directionEstablishment = 'asc';
  constructor(private businesService: BusinessService,
    private establishmentService: EstablishmentService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllBusiness();

    this.userForm = this.fb.group({
      FIRST_NAME: [[], [Validators.required]], // Campo requerido
      REGION: ["", [Validators.required]], // Campo requerido
    });
  }

  getAllBusiness() {
    this.businesService.getAllBusiness().subscribe({
      next: resp => {
        this.listBusiness = resp.status;
        this.cant = Math.ceil(this.listBusiness.length / 10);
        this.db = this.listBusiness.slice(0, 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
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

  getEstablishment(id_business: any) {
    this.establishmentService.getEstablishment(id_business).subscribe({
      next: resp => {
        if (resp.status) {
          this.establishmentStatus = resp.status;
          this.cant2 = Math.ceil(this.establishmentStatus.length / 10);
          this.db2 = this.establishmentStatus.slice(0, 10).sort((a: { ID_ESTABLISHMENT: number; }, b: { ID_ESTABLISHMENT: number; }) => b.ID_ESTABLISHMENT - a.ID_ESTABLISHMENT);
        }
        else {
          this.establishmentStatus = [];
        }
        this.reset()
      },
      error: r => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          text: r.msg,
          title: '¡Ups!'
        });
        this.reset()
      }
    });
  }

  addEstablishment(id_business: any) {

    if (this.verificarEstablecimiento()) {
      const { FIRST_NAME, REGION } = this.userForm.value;
      this.establishmentStatus.push(id_business);

      this.establishmentService.addEstablishment(FIRST_NAME, REGION, id_business).subscribe({
        next: resp => {
          if (resp.status) {
            this.pagTo2(0);
            Swal.fire({
              title: "Establecimiento agregado",
              text: "El establecimiento fue agregado exitosamente",
              icon: "success",
            })
          }
          this.getEstablishment(id_business);
        },
        error: err => {
          Swal.fire({
            title: 'Error',
            text: 'Error al agregar el establecimiento',
            icon: 'error'
          })
        }
      });
    }

    else{
      Swal.fire({
        title: 'Establecimiento y Región ya se encuentran registrados',
        text: '',
        icon: 'error'
      })
    }
  }

  deleteEstablishment(id_establishment: any) {
    Swal.fire({
      title: '¿Estás seguro que quieres eliminar el establecimiento?',
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.pagTo2(0)
        this.establishmentService.deleteEstablishment(id_establishment).subscribe({
          next: resp => {
            if (resp.status) {
              Swal.fire({
                title: "Establecimiento Eliminado",
                text: "",
                icon: "error",
              })
              this.getEstablishment(this.index);
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

  pagTo(i: number) {
    this.pos = i + 1;
    this.db = this.listBusiness.slice((i * 10), (i + 1) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.listBusiness.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.listBusiness.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  setArrayFromNumber() {
    return new Array(this.cant);
  }

  pagTo2(i: number) {
    this.pos2 = i + 1;
    this.db2 = this.establishmentStatus.slice((i * 10), (i + 1) * 10).sort((a: { ID_ESTABLISHMENT: number; }, b: { ID_ESTABLISHMENT: number; }) => a.ID_ESTABLISHMENT - b.ID_ESTABLISHMENT);
  }
  next2() {
    if (this.pos2 >= this.cant) return;
    this.pos2++;
    this.db2 = this.establishmentStatus.slice((this.pos2 - 1) * 10, (this.pos2) * 10).sort((a: { ID_ESTABLISHMENT: number; }, b: { ID_ESTABLISHMENT: number; }) => a.ID_ESTABLISHMENT - b.ID_ESTABLISHMENT);
  }
  previus2() {
    if (this.pos2 - 1 <= 0 || this.pos2 >= this.cant + 1) return;
    this.pos2 = this.pos2 - 1;
    this.db2 = this.establishmentStatus.slice((this.pos2 - 1) * 10, (this.pos2) * 10).sort((a: { ID_ESTABLISHMENT: number; }, b: { ID_ESTABLISHMENT: number; }) => a.ID_ESTABLISHMENT - b.ID_ESTABLISHMENT);
  }
  setArrayFromNumber2() {
    return new Array(this.cant2);
  }

  reset() {
    this.userForm.reset();
    this.userForm.patchValue({
      REGION: ""
    });
  }

  verificarEstablecimiento() {
    const { FIRST_NAME, REGION } = this.userForm.value;
    let existe = false;
    const nombreEstablecimiento = FIRST_NAME.trim(); // eliminando espacios en blanco adicionales al inicio y al final de la cadena de texto

    for (let i = 0; i < this.establishmentStatus.length; i++) {
      if (this.establishmentStatus[i].NAME_ESTABLISHMENT.toLowerCase() === nombreEstablecimiento.toLowerCase() && this.establishmentStatus[i].REGION === REGION) {
        existe = true;
        break;
      }
    }
    if (existe) {
      return false;  // el código se encuentra en el arreglo, hay errores
    } else {
      return true;  // el código NO se encuentra en el arreglo, no hay error
    }
  }

  toggleDirection() {
    this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    this.listBusiness.reverse();
    this.cant = Math.ceil(this.listBusiness.length / 10);
    this.db = this.listBusiness.slice(0, 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }

  toggleDirectionEstablishments() {
    this.directionEstablishment = this.directionEstablishment === 'asc' ? 'desc' : 'asc';
    this.establishmentStatus.reverse();
    this.cant2 = Math.ceil(this.establishmentStatus.length / 10);
    this.db2 = this.establishmentStatus.slice(0, 10).reverse();
  }

  filter(target: any) {
    const value = target.value?.toLowerCase();
    this.pos = 1;
    const listIndex:any = []
    if(target.value != ''){
      this.cant = 1;
      this.db = this.listBusiness.filter(r=>{
        if(r.NAME?.toLowerCase().indexOf(value) > -1 || r.CODE_BUSINESS?.toLowerCase().indexOf(value) > -1 || r.LOC_ADDRESS?.toLowerCase().indexOf(value) > -1) {
          listIndex.push(r);
        };
      });
      this.db = listIndex.slice(0, 10);
      this.cant = Math.ceil(listIndex.length / 10);
      return this.db;
    }
    this.db = this.listBusiness.slice(0, 10);
    this.cant = Math.ceil(this.listBusiness.length / 10);
    return this.db; 
  }

  filterForm(target: any) {
    const value = target.value?.toLowerCase();
    this.pos2 = 1;
    const listIndex:any = []
    if(target.value != ''){
      this.cant2 = 1;
      this.db2 = this.establishmentStatus.filter((r: any)=>{
        if(r.NAME_ESTABLISHMENT?.toLowerCase().indexOf(value) > -1 || r.REGION?.toLowerCase().indexOf(value) > -1) {
          listIndex.push(r);
        };
      });
      this.db2 = listIndex.slice(0, 10);
      this.cant2 = Math.ceil(listIndex.length / 10);
      return this.db2;
    }
    this.db2 = this.establishmentStatus.slice(0,10);
    this.cant2 = Math.ceil(this.establishmentStatus.length / 10);
    return this.db2;     
  }
}
