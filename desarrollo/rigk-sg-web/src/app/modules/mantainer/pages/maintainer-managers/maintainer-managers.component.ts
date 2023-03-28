import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BusinessService } from '../../../../core/services/business.service';
import { ManagerService } from 'src/app/core/services/manager.service';

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

  listMateriales: any[] = [
    'Papel',
    'Papel Compuesto (cemento)',
    'Caja Cartón',
    'Papel/Cartón Otro',
    'Envase Aluminio',
    'Malla o Reja (IBC)',
    'Envase Hojalata', 
    'Metal Otro',
    'Plástico Film Embalaje',
    'Plástico Envases Rígidos (Incl. Tapas)',
    'Plástico Sacos o Maxisacos',
    'Plástico EPS (Poliestireno Expandido)',
    'Plástico Zuncho',
    'Plástico Otro',
    'Caja de Madera',
    'Pallet de Madera'
    
  ];

  listBusiness: any[] = [];
  pos = 1;
  db: any[] = [];
  cant = 0;

  managerStatus: any = [];
  pos2 = 1;
  db2: any[] = [];
  cant2 = 0;

  index: number = 0;

  userData: any | null;

  MATERIAL: any = "";
  REGION: any = "";
  userForm: any;

  constructor(private businesService: BusinessService,
    private managerService: ManagerService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllBusiness();

    this.userForm = this.fb.group({
      MATERIAL: ["", [Validators.required]], // Campo requerido
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

  getManager(id_business: any) {
    this.managerService.getManager(id_business).subscribe({
      next: resp => {
        if (resp.status) {
          this.managerStatus = resp.status;
          this.cant2 = Math.ceil(this.managerStatus.length / 10);
          this.db2 = this.managerStatus.slice(0, 10).sort((a: { ID_MANAGER: number; }, b: { ID_MANAGER: number; }) => b.ID_MANAGER - a.ID_MANAGER);
        }
        else {
          this.managerStatus = [];
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

  addManager(id_business: any) {

    if (this.verificarEstablecimiento()) {
      const { MATERIAL, REGION } = this.userForm.value;
      this.managerStatus.push(id_business);

      this.managerService.addManager(MATERIAL, REGION, id_business).subscribe({
        next: resp => {
          if (resp.status) {
            this.pagTo2(0);
            Swal.fire({
              title: "Establecimiento agregado",
              text: "El establecimiento fue agregado exitosamente",
              icon: "success",
            })
          }
          this.getManager(id_business);
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

  deleteManager(id_manager: any) {
    Swal.fire({
      title: '¿Estás seguro que quieres eliminar el establecimiento?',
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.pagTo2(0)
        this.managerService.deleteManager(id_manager).subscribe({
          next: resp => {
            if (resp.status) {
              Swal.fire({
                title: "Establecimiento Eliminado",
                text: "",
                icon: "error",
              })
              this.getManager(this.index);
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
    this.db2 = this.managerStatus.slice((i * 10), (i + 1) * 10).sort((a: { ID_MANAGER: number; }, b: { ID_MANAGER: number; }) => a.ID_MANAGER - b.ID_MANAGER);
  }
  next2() {
    if (this.pos2 >= this.cant) return;
    this.pos2++;
    this.db2 = this.managerStatus.slice((this.pos2 - 1) * 10, (this.pos2) * 10).sort((a: { ID_MANAGER: number; }, b: { ID_MANAGER: number; }) => a.ID_MANAGER - b.ID_MANAGER);
  }
  previus2() {
    if (this.pos2 - 1 <= 0 || this.pos2 >= this.cant + 1) return;
    this.pos2 = this.pos2 - 1;
    this.db2 = this.managerStatus.slice((this.pos2 - 1) * 10, (this.pos2) * 10).sort((a: { ID_MANAGER: number; }, b: { ID_MANAGER: number; }) => a.ID_MANAGER - b.ID_MANAGER);
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
    const { MATERIAL, REGION } = this.userForm.value;
    let existe = false;
    const nombreEstablecimiento = MATERIAL.trim(); // eliminando espacios en blanco adicionales al inicio y al final de la cadena de texto

    for (let i = 0; i < this.managerStatus.length; i++) {
      if (this.managerStatus[i].TYPE_MATERIAL.toLowerCase() === nombreEstablecimiento.toLowerCase() && this.managerStatus[i].REGION === REGION) {
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
      this.db2 = this.managerStatus.filter((r: any)=>{
        if(r.TYPE_MATERIAL?.toLowerCase().indexOf(value) > -1 || r.REGION?.toLowerCase().indexOf(value) > -1) {
          listIndex.push(r);
        };
      });
      this.db2 = listIndex.slice(0, 10);
      this.cant2 = Math.ceil(listIndex.length / 10);
      return this.db2;
    }
    this.db2 = this.managerStatus.slice(0,10);
    this.cant2 = Math.ceil(this.managerStatus.length / 10);
    return this.db2;     
  }
}
