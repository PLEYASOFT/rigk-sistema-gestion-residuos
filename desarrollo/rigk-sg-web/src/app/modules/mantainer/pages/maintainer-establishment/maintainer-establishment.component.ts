import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/core/services/business.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth.service';
import { EstablishmentService } from 'src/app/core/services/establishment.service';

@Component({
  selector: 'app-maintainer-establishment',
  templateUrl: './maintainer-establishment.component.html',
  styleUrls: ['./maintainer-establishment.component.css']
})
export class MaintainerEstablishmentComponent implements OnInit {

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
  
  listBusiness: any [] = [];
  pos = 1;
  db: any[] = [];
  cant = 0;

  id_business: any [] = [];
  name_business: string [] = [];
  loc_address: string [] = [];

  id_establishment: any [] = [];
  name_establishment: string [] = [];
  region_establishment: string [] = [];

  establishmentStatus: any = [];
  establishmentNames: string[] = [];
  establishmentRegions: string[] = [];
  establishmentID: string[] = [];

  index: number = 0;

  userData: any | null;

  userForm = this.fb.group({
    FIRST_NAME: [],
    REGION: [0]
  })

  constructor(private authService: AuthService,
    private businesService: BusinessService,
    private establishmentService: EstablishmentService,
    private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllBusiness();
    this.getAllEstablishment();
  }

  getAllBusiness() {
    this.id_business= [];
    this.name_business= [];
    this.loc_address= [];
    this.businesService.getAllBusiness().subscribe({
      next: resp => {
        this.listBusiness = resp.status;
        this.cant = Math.ceil(this.listBusiness.length / 5);
        console.log(this.cant)
        this.db = this.listBusiness.slice(0, 5).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
        console.log(this.db)

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

  getAllEstablishment() {
    this.id_establishment= [];
    this.name_establishment= [];
    this.region_establishment= [];
    this.establishmentService.getAllEstablishment().subscribe({
      next: resp => {
        if (resp.status) {
          for(let i = 0; i < resp.status.length; i++)
          {
            this.id_establishment.push(resp.status[i].ID) ;
            this.name_establishment.push(resp.status[i].NAME_ESTABLISHMENT) ;
            this.region_establishment.push(resp.status[i].REGION) ;
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

  getEstablishment(id_business:any) {
    this.establishmentService.getEstablishment(id_business).subscribe({
      next: resp => {
        if (resp.status) {
          this.establishmentStatus = resp.status;
          this.establishmentNames = resp.status.map((e: any) => e.NAME_ESTABLISHMENT);
          this.establishmentRegions = resp.status.map((e: any) => e.REGION);
          this.establishmentID = resp.status.map((e: any) => e.ID_ESTABLISHMENT);
        }
        else{
          this.establishmentStatus = [];
          this.establishmentNames = [];
          this.establishmentRegions = [];
          this.establishmentID = [];
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

  addEstablishment(id_business:any) {
    
    const { FIRST_NAME, REGION} = this.userForm.value;
    if (!FIRST_NAME || !REGION) {
      Swal.fire({
        title: "Validar información",
        text: 'Debe completar todos los campos',
        icon: "error",
      });
      return;
    }
    
    this.establishmentNames[id_business - 1] = FIRST_NAME;
    this.establishmentRegions[id_business - 1] = REGION.toString();
    this.establishmentStatus.push(id_business);

    this.establishmentService.addEstablishment(FIRST_NAME,REGION,id_business).subscribe({
      next: resp => {
          if(resp.status ){
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

  deleteEstablishment(id_establishment:any) {
    Swal.fire({
      title: '¿Estás seguro que quieres eliminar el establecimiento??',
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: `Cancelar`,}).then((result) => {
        if (result.isConfirmed) {
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
    this.db = this.listBusiness.slice((i * 5), (i + 1) * 5).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.listBusiness.slice((this.pos - 1) * 5, (this.pos) * 5).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.listBusiness.slice((this.pos - 1) * 5, (this.pos) * 5).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }
  setArrayFromNumber() {
    return new Array(this.cant);
  }
}
