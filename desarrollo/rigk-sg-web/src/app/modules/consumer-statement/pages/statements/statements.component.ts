import { Component, OnInit, OnDestroy } from '@angular/core';
import { EstablishmentService } from 'src/app/core/services/establishment.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.css']
})
export class StatementsComponent implements OnInit {

  userData: any | null;
  dbStatements: any[] = [];
  db: any[] = [];
  pos = 1;

  business_name: any[] = [];
  establishment_name: any[] = [];
  material_name: any[] = [];
  treatment_name: any[] = [];
  years: number[] = [];
  cant: number = 0;
  filteredStatements: any[] = [];

  selectedBusiness: string = '-1';
  selectedEstablishment: string = '-1';
  selectedMaterial: string = '-1';
  selectedYear: string = '-1';
  private filtersApplied: boolean = false;
  autoFilter: boolean = true;

  constructor(
    public productorService: ProductorService,
    private establishmentService: EstablishmentService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);

    // Cargar el estado de los filtros si está disponible
    this.loadState();

    // Verificar si la página anterior no es una página de detalle
    const previousUrl = this.location.getState() as { navigationId?: number; url?: string };
    const notDetailPage = previousUrl && previousUrl.url && !previousUrl.url.match(/\/consumidor\/statements\/\d+/);
    if (previousUrl.navigationId && notDetailPage) {
      this.resetFilters();
    }

    this.loadStatements().then(() => {
      this.updateFilters();
      if (!this.filtersApplied) {
        this.filter();
        this.pagTo(this.pos - 1);
        this.filtersApplied = true;
      }
    });
  }

  formatValue(value: number): string {
    if (value % 1 === 0) {
      return value.toString();
    } else {
      return value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }
  resetFilters() {
    this.selectedBusiness = '-1';
    this.selectedEstablishment = '-1';
    this.selectedMaterial = '-1';
    this.selectedYear = '-1';
  }

  loadStatements(): Promise<void> {
    return new Promise<void>((resolve) => {
      Swal.fire({
        title: 'Cargando Datos',
        text: 'Se están recuperando datos',
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false
      });
      Swal.showLoading();
      this.establishmentService.getDeclarationEstablishment().subscribe(r => {
        if (r.status) {
          r.status = r.status.sort(((a: any, b: any) => new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime()));

          (r.status as any[]).forEach(e => {

            if (this.business_name.indexOf(e.NAME_BUSINESS) == -1) {
              this.business_name.push(e.NAME_BUSINESS);
            }
            if (this.establishment_name.indexOf(e.NAME_ESTABLISHMENT_REGION) == -1) {
              this.establishment_name.push(e.NAME_ESTABLISHMENT_REGION);
            }
            if (this.years.indexOf(e.FechaRetiroTipeada) == -1) {
              this.years.push(e.FechaRetiroTipeada)
            }
            if (this.material_name.indexOf(e.TYPE_RESIDUE) == -1) {
              this.material_name.push(e.TYPE_RESIDUE)
            }
            if (this.treatment_name.indexOf(e.TipoTratamiento) == -1) {
              this.treatment_name.push(e.TipoTratamiento)
            }
          });
          this.years.sort((a, b) => b - a);
          this.dbStatements = r.status;
          this.cant = Math.ceil(this.dbStatements.length / 10);
          this.db = this.dbStatements.slice((this.pos - 1) * 10, this.pos * 10).sort((a, b) => new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime()).reverse();;
          Swal.close();
        }
        resolve();
      })
    });
  }


  filter(auto: boolean = false) {
    if (auto && !this.autoFilter) return;

    this.filteredStatements = this.dbStatements.filter(r => {
      return (
        (this.selectedBusiness === '-1' || r.NAME_BUSINESS === this.selectedBusiness) &&
        (this.selectedEstablishment === '-1' || r.NAME_ESTABLISHMENT_REGION === this.selectedEstablishment) &&
        (this.selectedMaterial === '-1' || r.PRECEDENCE === this.selectedMaterial) &&
        (this.selectedYear === '-1' || r.FechaRetiroTipeada === this.selectedYear)
      );
    });
    this.db = this.filteredStatements.slice(0, 10).sort((a, b) => new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime()).reverse();;
    this.cant = Math.ceil(this.filteredStatements.length / 10);
    this.saveState();
    this.filtersApplied = false;
  }


  updateFilters() {
    // Filtrar las opciones de business_name
    this.business_name = this.dbStatements
      .filter(
        (r) =>
          (this.selectedEstablishment === "-1" ||
            r.NAME_ESTABLISHMENT_REGION === this.selectedEstablishment) &&
          (this.selectedMaterial === "-1" || r.PRECEDENCE === this.selectedMaterial) &&
          (this.selectedYear === "-1" || r.FechaRetiroTipeada === this.selectedYear)
      )
      .map((r) => r.NAME_BUSINESS)
      .filter((value, index, self) => self.indexOf(value) === index);

    // Filtrar las opciones de establishment_name
    this.establishment_name = this.dbStatements
      .filter(
        (r) =>
          (this.selectedBusiness === "-1" || r.NAME_BUSINESS === this.selectedBusiness) &&
          (this.selectedMaterial === "-1" || r.PRECEDENCE === this.selectedMaterial) &&
          (this.selectedYear === "-1" || r.FechaRetiroTipeada === this.selectedYear)
      )
      .map((r) => r.NAME_ESTABLISHMENT_REGION)
      .filter((value, index, self) => self.indexOf(value) === index);

    // Filtrar las opciones de material_name
    this.material_name = this.dbStatements
      .filter(
        (r) =>
          (this.selectedBusiness === "-1" || r.NAME_BUSINESS === this.selectedBusiness) &&
          (this.selectedEstablishment === "-1" ||
            r.NAME_ESTABLISHMENT_REGION === this.selectedEstablishment) &&
          (this.selectedYear === "-1" || r.FechaRetiroTipeada === this.selectedYear)
      )
      .map((r) => r.PRECEDENCE)
      .filter((value, index, self) => self.indexOf(value) === index);

    // Filtrar las opciones de years
    this.years = this.dbStatements
      .filter(
        (r) =>
          (this.selectedBusiness === "-1" || r.NAME_BUSINESS === this.selectedBusiness) &&
          (this.selectedEstablishment === "-1" ||
            r.NAME_ESTABLISHMENT_REGION === this.selectedEstablishment) &&
          (this.selectedMaterial === "-1" || r.PRECEDENCE === this.selectedMaterial)
      )
      .map((r) => r.FechaRetiroTipeada)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => b - a);
  }

  reset() {
    this.loadStatements();
  }
  pagTo(i: number) {
    this.pos = i + 1;
    this.db = this.filteredStatements.slice((i * 10), (i + 1) * 10).sort((a, b) => new Date(a.FechaRetiro).getTime() - new Date(b.FechaRetiro).getTime()).reverse();
  }

  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.filteredStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => new Date(a.FechaRetiro).getTime() - new Date(b.FechaRetiro).getTime()).reverse();
  }

  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.filteredStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => new Date(a.FechaRetiro).getTime() - new Date(b.FechaRetiro).getTime()).reverse();
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

  saveState() {
    const state = {
      selectedBusiness: this.selectedBusiness,
      selectedEstablishment: this.selectedEstablishment,
      selectedMaterial: this.selectedMaterial,
      selectedYear: this.selectedYear,
      pos: this.pos,
    };
    localStorage.setItem('statementsState', JSON.stringify(state));
  }

  loadState() {
    const state = JSON.parse(localStorage.getItem('statementsState') || '{}');
    if (state) {
      this.selectedBusiness = state.selectedBusiness || '-1';
      this.selectedEstablishment = state.selectedEstablishment || '-1';
      this.selectedMaterial = state.selectedMaterial || '-1';
      this.selectedYear = state.selectedYear || '-1';
      this.pos = state.pos || 1;
    }
  }

  goToDetails(headerId: string, detailId: string) {
    this.saveState();
    this.router.navigate(['/consumidor/statements/', headerId, detailId]);
  }
}
