import { Component, OnInit } from '@angular/core';
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

  listRegiones: any[] = [];
  listMateriales: any[] = [];

  filteredList: any[] = [];
  filteredForm: any[] = [];
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
  FILTER: string = "";
  userForm: any;

  constructor(private businesService: BusinessService,
    private managerService: ManagerService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllBusiness();
    this.getMaterials();
    this.userForm = this.fb.group({
      MATERIAL: ["", [Validators.required]], // Campo requerido
      REGION: ["", [Validators.required]], // Campo requerido
      FILTER: [[],[]]
    });
    this.getRegions();
  }

  getAllBusiness() {
    this.businesService.getAllBusiness().subscribe({
      next: resp => {
        this.listBusiness = resp.status;
        this.filteredList = resp.status;
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

  getMaterials() {
    this.managerService.getAllMaterials().subscribe({
      next: resp => {
        this.listMateriales = resp.status.map((material: { MATERIAL: any; }) => material.MATERIAL);
        this.listMateriales.sort((a, b) => a.localeCompare(b));
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
  
  getRegions() {
    this.managerService.getAllRegions().subscribe({
      next: resp => {
        this.listRegiones = resp.data;
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
          this.filteredForm = resp.status;
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

  getMaterialID(materialName: string) {
    const material = this.listMateriales.find(m => m === materialName);
    const index = this.listMateriales.indexOf(material);
    let id = index >= 0 ? index + 1 : null; // sumar 1 al índice para obtener el ID correspondiente
    switch(id){
      case 1 : id = 4;
      break;
      case 3 : id = 5;
      break;
      case 4 : id = 1;
      break;
      case 5 : id = 3;
      break;
    }
    return id;
  }

  async addManager(id_business: any) {
    if (this.verificarEstablecimiento()) {
      const MATERIAL = this.getMaterialID(this.userForm.value.MATERIAL);
      const { REGION } = this.userForm.value;
      const REGION_NAME = await this.managerService.getRegionFromID(REGION).toPromise();
      this.managerStatus.push(id_business);
      
      this.managerService.addManager(MATERIAL, REGION_NAME.status[0].NAME, id_business, REGION).subscribe({
        next: resp => {
          if (resp.status) {
            this.pagTo2(0);
            Swal.fire({
              title: "Gestor agregado",
              text: "El gestor fue agregado exitosamente",
              icon: "success",
            })
          }
          this.getManager(id_business);
        },
        error: err => {
          Swal.fire({
            title: 'Error',
            text: 'Error al agregar el Gestor',
            icon: 'error'
          })
        }
      });
    }

    else {
      Swal.fire({
        title: 'Material y Región ya se encuentran registrados',
        text: '',
        icon: 'error'
      })
    }
  }

  deleteManager(id_manager: any) {
    Swal.fire({
      title: '¿Estás seguro que quieres eliminar el gestor?',
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
                title: "Gestor Eliminado",
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
    this.db = this.filteredList.slice((i * 10), (i + 1) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.filteredList.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.filteredList.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  setArrayFromNumber() {
    return new Array(this.cant);
  }

  pagTo2(i: number) {
    this.pos2 = i + 1;
    this.db2 = this.filteredForm.slice((i * 10), (i + 1) * 10).sort((a: { ID_MANAGER: number; }, b: { ID_MANAGER: number; }) => a.ID_MANAGER - b.ID_MANAGER);
  }
  next2() {
    if (this.pos2 >= this.cant2) return;
    this.pos2++;
    this.db2 = this.filteredForm.slice((this.pos2 - 1) * 10, (this.pos2) * 10).sort((a: { ID_MANAGER: number; }, b: { ID_MANAGER: number; }) => a.ID_MANAGER - b.ID_MANAGER);
  }
  previus2() {
    if (this.pos2 - 1 <= 0 || this.pos2 >= this.cant2 + 1) return;
    this.pos2 = this.pos2 - 1;
    this.db2 = this.filteredForm.slice((this.pos2 - 1) * 10, (this.pos2) * 10).sort((a: { ID_MANAGER: number; }, b: { ID_MANAGER: number; }) => a.ID_MANAGER - b.ID_MANAGER);
  }
  setArrayFromNumber2() {
    return new Array(this.cant2);
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

  reset() {
    this.pagTo2(0);
    this.userForm.reset();
    this.userForm.patchValue({
      MATERIAL: "",
      REGION: "",
      FILTER: ""
    });

  } 

  verificarEstablecimiento() {
    const { MATERIAL, REGION } = this.userForm.value;
    let existe = false;
    const nombreEstablecimiento = MATERIAL.trim(); // eliminando espacios en blanco adicionales al inicio y al final de la cadena de texto
    
    
    for (let i = 0; i < this.managerStatus.length; i++) {
      if (this.managerStatus[i].MATERIAL.toLowerCase() === nombreEstablecimiento.toLowerCase() && this.managerStatus[i].ID_REGION === parseInt(REGION)) {
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
    const listIndex: any = []
    if (target.value != '') {
      this.cant = 1;
      this.db = this.listBusiness.filter(r => {
        if (r.NAME?.toLowerCase().indexOf(value) > -1 || r.CODE_BUSINESS?.toLowerCase().indexOf(value) > -1 || r.LOC_ADDRESS?.toLowerCase().indexOf(value) > -1) {
          listIndex.push(r);
        };
      })
      this.filteredList = listIndex;
      this.db = listIndex.slice(0, 10);
      this.cant = Math.ceil(listIndex.length / 10);
      return this.db;
    }
    this.filteredList = this.listBusiness;
    this.db = this.listBusiness.slice(0, 10);
    this.cant = Math.ceil(this.listBusiness.length / 10);
    return this.db;
  }
  
  filterForm(target: any) {
    const value = target.value?.toLowerCase();
    this.pos2 = 1;
    const listIndex: any = []
    if (target.value != '') {
      this.cant2 = 1;
      this.db2 = this.managerStatus.filter((r: any) => {
        if (r.MATERIAL?.toLowerCase().indexOf(value) > -1 || r.REGION?.toLowerCase().indexOf(value) > -1) {
          listIndex.push(r);
        };
      });
      this.filteredForm = listIndex;
      this.db2 = listIndex.slice(0, 10);
      this.cant2 = Math.ceil(listIndex.length / 10);
      return this.db2;
    }
    this.filteredForm = this.managerStatus;
    this.db2 = this.managerStatus.slice(0, 10);
    this.cant2 = Math.ceil(this.managerStatus.length / 10);
    return this.db2;
  }
}
