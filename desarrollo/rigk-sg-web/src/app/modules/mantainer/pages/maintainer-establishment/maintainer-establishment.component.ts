import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/core/services/business.service';
import Swal from 'sweetalert2';
import { EstablishmentService } from 'src/app/core/services/establishment.service';
import { ManagerService } from 'src/app/core/services/manager.service';

@Component({
  selector: 'app-maintainer-establishment',
  templateUrl: './maintainer-establishment.component.html',
  styleUrls: ['./maintainer-establishment.component.css']
})
export class MaintainerEstablishmentComponent implements OnInit {

  listRegiones: any[] = [];
  listComunas: any[] = [];
  listCommunesFormated: any[] = [];
  listBusiness: any[] = [];
  pos = 1;
  db: any[] = [];
  cant = 0;

  establishmentStatus: any = [];
  pos2 = 1;
  db2: any[] = [];
  cant2 = 0;

  filteredList: any[] = [];
  filteredForm: any[] = [];
  index: number = 0;

  userData: any | null;

  NAME: any = [];
  ADDRESS: any = [];
  ID_REGION: any = "";
  NAME_REGION: string = "";
  ID_COMUNA: any = "";
  V_UNIQUE: any = [];
  FILTER: string = '';
  userForm: any;

  direction = 'asc';
  directionEstablishment = 'asc';
  constructor(private businesService: BusinessService,
    private managerService: ManagerService,
    private establishmentService: EstablishmentService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllBusiness();
    this.getRegions();
    this.getCommunesFormatted();

    this.userForm = this.fb.group({
      NAME: [[], [Validators.required]], // Campo requerido
      ADDRESS: [[], [Validators.required]], // Campo requerido
      ID_REGION: ["", [Validators.required]], // Campo requerido
      ID_COMUNA: ["", [Validators.required]], // Campo requerido
      V_UNIQUE: [[], [Validators.required]], // Campo requerido
      FILTER: [[], []]
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

  getCommunesFormatted(){
    this.managerService.getCommunesFormatted().subscribe({
      next: resp => {
        this.listCommunesFormated = resp.data;    
      },
      error: r => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          text: r.msg,
          title: '¡Ups!'
        });
      }
    })
  }

  communesFilter(event: any) {
    // Convierte el valor a número
    const selectedRegionId = +event.target.value;
    const selectedIndex = event.target.selectedIndex;
    if (selectedIndex > 0) {
      this.NAME_REGION = this.listRegiones[selectedIndex -1].NAME; // Nombre de la región seleccionada
    }
    // Filtrar la lista de comunas por regions_id
    this.listComunas = this.listCommunesFormated.filter(item => item.regions_id === selectedRegionId);
    this.listComunas.sort((a, b) => a.communes_name.localeCompare(b.communes_name));
    this.userForm.patchValue({ ID_COMUNA: '' });
  }

  getAllBusiness() {
    this.businesService.getAllBusiness().subscribe({
      next: resp => {
        this.listBusiness = resp.status;
        this.filteredForm = resp.status;
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
          this.filteredList = resp.status;
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
      const { NAME, ID_REGION, ID_COMUNA, V_UNIQUE, ADDRESS } = this.userForm.value;
      this.establishmentStatus.push(id_business);

      this.establishmentService.addEstablishment(NAME, this.NAME_REGION, V_UNIQUE, ID_REGION, ID_COMUNA, ADDRESS, id_business).subscribe({
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
        title: 'Establecimiento, Región y Comuna ya se encuentran registrados',
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
    this.db = this.filteredForm.slice((i * 10), (i + 1) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.filteredForm.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.filteredForm.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  setArrayFromNumber() {
    return new Array(this.cant);
  }

  pagTo2(i: number) {
    this.pos2 = i + 1;
    this.db2 = this.filteredList.slice((i * 10), (i + 1) * 10).sort((a: { ID_ESTABLISHMENT: number; }, b: { ID_ESTABLISHMENT: number; }) => a.ID_ESTABLISHMENT - b.ID_ESTABLISHMENT);
  }
  next2() {
    if (this.pos2 >= this.cant2) return;
    this.pos2++;
    this.db2 = this.filteredList.slice((this.pos2 - 1) * 10, (this.pos2) * 10).sort((a: { ID_ESTABLISHMENT: number; }, b: { ID_ESTABLISHMENT: number; }) => a.ID_ESTABLISHMENT - b.ID_ESTABLISHMENT);
  }
  previus2() {
    if (this.pos2 - 1 <= 0 || this.pos2 >= this.cant2 + 1) return;
    this.pos2 = this.pos2 - 1;
    this.db2 = this.filteredList.slice((this.pos2 - 1) * 10, (this.pos2) * 10).sort((a: { ID_ESTABLISHMENT: number; }, b: { ID_ESTABLISHMENT: number; }) => a.ID_ESTABLISHMENT - b.ID_ESTABLISHMENT);
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
      REGION: "",
      FILTER: ""
    });
  }

  verificarEstablecimiento() {
    const { NAME, ID_COMUNA } = this.userForm.value;
    let existe = false;
    const nombreEstablecimiento = NAME.trim(); // eliminando espacios en blanco adicionales al inicio y al final de la cadena de texto

    for (let i = 0; i < this.establishmentStatus.length; i++) {
      if (this.establishmentStatus[i].NAME_ESTABLISHMENT.toLowerCase() === nombreEstablecimiento.toLowerCase() && this.establishmentStatus[i].REGION === this.NAME_REGION && this.establishmentStatus[i].ID_COMUNA === parseInt(ID_COMUNA)) {
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
      this.filteredForm = listIndex;
      this.db = listIndex.slice(0, 10);
      this.cant = Math.ceil(listIndex.length / 10);
      return this.db;
    }
    this.filteredForm = this.listBusiness;
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
        if(r.NAME_ESTABLISHMENT?.toLowerCase().indexOf(value) > -1 || r.ADDRESS?.toLowerCase().indexOf(value) > -1 || r.REGION?.toLowerCase().indexOf(value) > -1 || r.NAME_COMMUNE?.toLowerCase().indexOf(value) > -1 || r.ID_VU?.toLowerCase().indexOf(value) > -1 ) {
          listIndex.push(r);
        };
      });
      this.filteredList = listIndex;
      this.db2 = listIndex.slice(0, 10);
      this.cant2 = Math.ceil(listIndex.length / 10);
      return this.db2;
    }
    this.filteredList = this.establishmentStatus;
    this.db2 = this.establishmentStatus.slice(0,10);
    this.cant2 = Math.ceil(this.establishmentStatus.length / 10);
    return this.db2;     
  }
}
