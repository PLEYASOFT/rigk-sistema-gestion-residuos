import { Component, OnInit } from '@angular/core';
import { EstablishmentService } from 'src/app/core/services/establishment.service';
import { ProductorService } from 'src/app/core/services/productor.service';
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

  constructor(public productorService: ProductorService,
    private establishmentService: EstablishmentService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.loadStatements();
    this.updateFilters();
    this.filter();
  }


  loadStatements() {
    Swal.fire({
      title: 'Cargando Datos',
      text: 'Se está recuperando datos',
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.establishmentService.getDeclarationEstablishment().subscribe(r => {
      if (r.status) {
        r.status = r.status.sort(((a: any, b: any) => b.YEAR_STATEMENT - a.YEAR_STATEMENT));

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
        this.db = this.dbStatements.slice(0, 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
        Swal.close();
      }
    })
  }

  filter() {
    this.filteredStatements = this.dbStatements.filter(r => {
      return (
        (this.selectedBusiness === '-1' || r.NAME_BUSINESS === this.selectedBusiness) &&
        (this.selectedEstablishment === '-1' || r.NAME_ESTABLISHMENT_REGION === this.selectedEstablishment) &&
        (this.selectedMaterial === '-1' || r.PRECEDENCE === this.selectedMaterial) &&
        (this.selectedYear === '-1' || r.FechaRetiroTipeada === this.selectedYear)
      );
    });
    this.db = this.filteredStatements.slice(0, 10).sort((a, b) => b.FechaRetiroTipeada - a.FechaRetiroTipeada);
    this.cant = Math.ceil(this.filteredStatements.length / 10);
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
    this.db = this.filteredStatements.slice((i * 10), (i + 1) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }

  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.filteredStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }

  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.filteredStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }

  setArrayFromNumber() {
    return new Array(this.cant);
  }
}
