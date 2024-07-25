import { Component, OnInit } from '@angular/core';
import { EstablishmentService } from 'src/app/core/services/establishment.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ConsumerService } from 'src/app/core/services/consumer.service';

@Component({
  selector: 'app-visualizar-mv',
  templateUrl: './visualizar-mv.component.html',
  styleUrls: ['./visualizar-mv.component.css']
})
export class VisualizarMvComponent implements OnInit {
  checkboxState: { [id: string]: boolean } = {};
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
  filteredBusinesses: any[] = [];
  filteredEstablishments: any[] = [];
  filteredMaterial: any[] = [];
  filteredYear: any[] = [];

  selectedBusiness: string = '-1';
  selectedEstablishment: string = '-1';
  selectedMaterial: string = '-1';
  selectedYear: string = '-1';
  private filtersApplied: boolean = false;
  autoFilter: boolean = true;

  constructor(
    private establishmentService: EstablishmentService,
    private consumer: ConsumerService,
    private router: Router,
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Verificar si la ruta actual no es una de las especificadas
      if (!this.isRelevantRoute(event.urlAfterRedirects)) {
        this.resetFilters();
        this.saveState(); // Guarda el estado reseteado
      }
    });
  }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);

    // Cargar el estado de los filtros si está disponible
    this.loadState();
    this.loadStatements().then(() => {
      this.updateFilters();
      if (!this.filtersApplied) {
        this.filter();
        this.pagTo(this.pos - 1);
        this.filtersApplied = true;
      }
    });
  }

  isRelevantRoute(url: string): boolean {
    // Definir las rutas relevantes
    return url === '/mantenedor/ci' ||
      url.startsWith('/mantenedor/ci/') && !url.endsWith('/ci');
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
    this.pos = 1;
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
      this.establishmentService.getAllDeclarationEstablishments().subscribe(r => {
        if (r.status) {
          r.status = r.status.map((item: any) => {
            item.FechaParaOrdenar = (item.MesRetiro != "" && item.MesRetiro != null) ? item.MesRetiro : item.FechaRetiro;
            return item;
          });
          const uniqueMap = new Map();
          r.status.forEach((item: any) => {
            if (!uniqueMap.has(item.ID_DETAIL)) {
              uniqueMap.set(item.ID_DETAIL, item);
            }
          });
          const uniqueStatus = Array.from(uniqueMap.values());
          uniqueStatus.sort((a: any, b: any) => new Date(b.FechaParaOrdenar).getTime() - new Date(a.FechaParaOrdenar).getTime());

          uniqueStatus.forEach(e => {
            if (e.MesRetiro != "" && e.MesRetiro != null) {
              e.FechaMostrar = e.MesRetiro;
            } else {
                e.FechaMostrar = e.FechaRetiro;
            }
            const businessEntry = { code: e.CODE_BUSINESS, name: e.NAME_BUSINESS, label: `${e.CODE_BUSINESS} — ${e.NAME_BUSINESS}` };
            if (!this.business_name.some(b => b.label === businessEntry.label)) {
              this.business_name.push(businessEntry);
            }
            if (!this.establishment_name.includes(e.NAME_ESTABLISHMENT_REGION)) {
              this.establishment_name.push(e.NAME_ESTABLISHMENT_REGION);
            }
            if (!this.years.includes(e.FechaRetiroTipeada)) {
              this.years.push(e.FechaRetiroTipeada);
            }
            if (!this.material_name.includes(e.TYPE_RESIDUE)) {
              this.material_name.push(e.TYPE_RESIDUE);
            }
            if (!this.treatment_name.includes(e.TipoTratamiento)) {
              this.treatment_name.push(e.TipoTratamiento);
            }
          });

          this.years.sort((a, b) => b - a);
          this.dbStatements = uniqueStatus;
          this.cant = Math.ceil(this.dbStatements.length / 10);
          this.db = this.dbStatements.slice((this.pos - 1) * 10, this.pos * 10).sort((a, b) => new Date(b.FechaMostrar).getTime() - new Date(a.FechaMostrar).getTime()).reverse();
          Swal.close();
        }
        resolve();
      });
    });
  }

  filter(auto: boolean = false) {
    const selectedBusinessValue = (this.selectedBusiness as any)?.value === '-1' ? '-1' : (this.selectedBusiness as any)?.label || this.selectedBusiness;
    const selectedEstablishmentValue = (this.selectedEstablishment as any)?.value || this.selectedEstablishment;
    const selectedMaterialValue = (this.selectedMaterial as any)?.value || this.selectedMaterial;
    const selectedYearValue = (this.selectedYear as any)?.value || this.selectedYear;

    if (auto && !this.autoFilter) return;

    this.filteredStatements = this.dbStatements.filter(r => {
      return (
        (selectedBusinessValue === '-1' || `${r.CODE_BUSINESS} — ${r.NAME_BUSINESS}` === selectedBusinessValue) &&
        (selectedEstablishmentValue === '-1' || r.NAME_ESTABLISHMENT_REGION === selectedEstablishmentValue) &&
        (selectedMaterialValue === '-1' || r.PRECEDENCE === selectedMaterialValue) &&
        (selectedYearValue === '-1' || r.FechaRetiroTipeada === selectedYearValue)
      );
    });
    this.db = this.filteredStatements.slice(0, 10).sort((a, b) => new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime()).reverse();
    this.cant = Math.ceil(this.filteredStatements.length / 10);
    this.saveState();
    this.filtersApplied = false;
    this.updateFilters();
  }

  filterBusinesses(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredBusinesses = this.business_name
      .filter(business => business.label?.toLowerCase().includes(query))
      .sort((a, b) => a.label.localeCompare(b.label));
    if (this.filteredBusinesses.length === 0) {
      this.filteredBusinesses = [{ label: 'Todos', value: '-1' }];
    } else {
      this.filteredBusinesses.unshift({ label: 'Todos', value: '-1' });
    }
  }

  filterEstablishments(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredEstablishments = this.establishment_name
      .filter((na: string) => na.toLowerCase().includes(query))
      .map((na: string) => ({ label: na, value: na }))
      .sort((a, b) => a.label.localeCompare(b.label));
    if (this.filteredEstablishments.length === 0) {
      this.filteredEstablishments = [{ label: 'Todos', value: '-1' }];
    } else {
      this.filteredEstablishments.unshift({ label: 'Todos', value: '-1' });
    }
  }

  filterMaterial(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredMaterial = this.material_name
      .filter((na: string) => na.toLowerCase().includes(query))
      .map((na: string) => ({ label: na, value: na }))
      .sort((a, b) => a.label.localeCompare(b.label));
    if (this.filteredMaterial.length === 0) {
      this.filteredMaterial = [{ label: 'Todos', value: '-1' }];
    } else {
      this.filteredMaterial.unshift({ label: 'Todos', value: '-1' });
    }
  }

  filterYear(event: any) {
    const query = event.query?.toString() || '';
    this.filteredYear = this.years
      .filter((year: number) => year.toString().includes(query))
      .map((year: number) => ({ label: year.toString(), value: year.toString() }));
    if (this.filteredYear.length > 0) {
      this.filteredYear.unshift({ label: 'Todos', value: '-1' });
    } else {
      this.filteredYear = [{ label: 'Todos', value: '-1' }];
    }
  }

  updateFilters() {
    const selectedBusinessValue = (this.selectedBusiness as any)?.value === '-1' ? '-1' : (this.selectedBusiness as any)?.label || this.selectedBusiness;
    const selectedEstablishmentValue = (this.selectedEstablishment as any)?.value || this.selectedEstablishment;
    const selectedMaterialValue = (this.selectedMaterial as any)?.value || this.selectedMaterial;
    const selectedYearValue = (this.selectedYear as any)?.value || this.selectedYear;

    // Filtrar las opciones de business_name
    this.business_name = this.dbStatements
      .filter(
        (r) =>
          (selectedEstablishmentValue === "-1" || r.NAME_ESTABLISHMENT_REGION === selectedEstablishmentValue) &&
          (selectedMaterialValue === "-1" || r.PRECEDENCE === selectedMaterialValue) &&
          (selectedYearValue === "-1" || r.FechaRetiroTipeada === selectedYearValue)
      )
      .map((r) => ({ code: r.CODE_BUSINESS, name: r.NAME_BUSINESS, label: `${r.CODE_BUSINESS} — ${r.NAME_BUSINESS}` }))
      .filter((value, index, self) => self.findIndex(v => v.label === value.label) === index);

    // Filtrar las opciones de establishment_name
    this.establishment_name = this.dbStatements
      .filter(
        (r) =>
          (selectedBusinessValue === "-1" || `${r.CODE_BUSINESS} — ${r.NAME_BUSINESS}` === selectedBusinessValue) &&
          (selectedMaterialValue === "-1" || r.PRECEDENCE === selectedMaterialValue) &&
          (selectedYearValue === "-1" || r.FechaRetiroTipeada === selectedYearValue)
      )
      .map((r) => r.NAME_ESTABLISHMENT_REGION)
      .filter((value, index, self) => self.indexOf(value) === index);

    // Filtrar las opciones de material_name
    this.material_name = this.dbStatements
      .filter(
        (r) =>
          (selectedBusinessValue === "-1" || `${r.CODE_BUSINESS} — ${r.NAME_BUSINESS}` === selectedBusinessValue) &&
          (selectedEstablishmentValue === "-1" || r.NAME_ESTABLISHMENT_REGION === selectedEstablishmentValue) &&
          (selectedYearValue === "-1" || r.FechaRetiroTipeada === selectedYearValue)
      )
      .map((r) => r.PRECEDENCE)
      .filter((value, index, self) => self.indexOf(value) === index);

    // Filtrar las opciones de years
    this.years = this.dbStatements
      .filter(
        (r) =>
          (selectedBusinessValue === "-1" || `${r.CODE_BUSINESS} — ${r.NAME_BUSINESS}` === selectedBusinessValue) &&
          (selectedEstablishmentValue === "-1" || r.NAME_ESTABLISHMENT_REGION === selectedEstablishmentValue) &&
          (selectedMaterialValue === "-1" || r.PRECEDENCE === selectedMaterialValue)
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
    this.db = this.filteredStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime()).reverse();
  }

  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.filteredStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime()).reverse();
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
    this.router.navigate(['/mantenedor/ci/', headerId, detailId]);
  }

  isAnyCheckboxSelected(): boolean {
    return Object.values(this.checkboxState).some(value => value);
  }

  downloadSelected() {
    const selectedItems = this.dbStatements.filter(s => this.checkboxState[s.ID_HEADER]);

    const itemsToDownload = selectedItems.map(s => {
      // Convertir la fecha a un objeto Date
      const fechaRetiro = new Date(s.FechaRetiro);

      // Formatear la fecha como dd-MM-yyyy
      const formattedDate = `${fechaRetiro.getDate().toString().padStart(2, '0')}-${(fechaRetiro.getMonth() + 1).toString().padStart(2, '0')}-${fechaRetiro.getFullYear()}`;

      return {
        id: s.ID_DETAIL,
        additionalData: {
          empresa: s.NAME_BUSINESS,
          establecimiento: s.NAME_ESTABLISHMENT_REGION,
          tipoTratamiento: s.TipoTratamiento,
          material: s.PRECEDENCE,
          subtipo: s.TYPE_RESIDUE,
          fechaRetiro: formattedDate
        }
      };
    });
    if (itemsToDownload.length > 0) {
      this.consumer.downloadMVSelected(itemsToDownload).subscribe(blob => {
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'medios_de_verificacion.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, error => {
        // Manejar errores aquí
        console.error('Error al descargar los archivos:', error);
      });
    }
  }

  deselectAllCheckboxes() {
    // Reiniciar el estado de todos los checkbox a false
    this.checkboxState = {};
    this.db.forEach(s => {
      this.checkboxState[s.ID_HEADER] = false;
    });
  }

  showButtonClicked() {
    this.deselectAllCheckboxes();
    this.filter();
    this.pagTo(0);
  }

  deleteEntry(id: string) {
    Swal.fire({
      title: '¿Desea eliminar la declaración?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.consumer.deleteDeclarationCI(id).subscribe((response: any) => {
          if (response.status) {
            Swal.fire(
              'Eliminado!',
              'La declaración ha sido eliminada.',
              'success'
            );
            // Actualizar la lista manualmente después de la eliminación
            this.dbStatements = this.dbStatements.filter(statement => statement.ID_HEADER !== id);
            this.filteredStatements = this.filteredStatements.filter(statement => statement.ID_HEADER !== id);
            this.pagTo(this.pos - 1);
          } else {
            Swal.fire(
              'Error!',
              'No se pudo eliminar la declaración.',
              'error'
            );
          }
        });
      }
    });
  }
}
