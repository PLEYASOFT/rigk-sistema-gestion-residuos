import { Component, OnInit } from '@angular/core';
import { ProductorService } from '../../../../core/services/productor.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-maintainer-productor',
  templateUrl: './maintainer-productor.component.html',
  styleUrls: ['./maintainer-productor.component.css']
})
export class MaintainerProductorComponent implements OnInit {

  form: FormGroup;
  dbStatements: any[] = [];
  filtered: any[] = [];
  db: any[] = [];
  pos = 1;

  business_name: any[] = [];
  business_year: any[] = [];
  years: number[] = [];
  cant: number = 0;
  selectedYear: any = '-1';

  selectedBusiness: any;
  filteredBusinesses: any[] = [];
  filteredYear: any[] = [];

  constructor(public productorService: ProductorService, private router: Router) {
    this.form = new FormGroup({
      BUSINESS: new FormControl(null, Validators.required),
      YEAR: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    this.loadStatements();
  }

  filterBusinesses(event: any) {
    const query = event.query.toLowerCase();
    this.filteredBusinesses = this.business_name.filter(business => {
      return business.label.toLowerCase().includes(query);
    });

    if (this.filteredBusinesses.length > 0) {
      this.filteredBusinesses.unshift({ label: 'Todos', value: '-1' });
    } else {
      this.filteredBusinesses = [{ label: 'Todos', value: '-1' }];
    }
  }

  filterYear(event: any) {
    const query = event.query;
    this.filteredYear = this.business_year.filter(year => {
      return year.label.toString().startsWith(query);
    });

    if (this.filteredYear.length > 0) {
      this.filteredYear.unshift({ label: 'Todos', value: '-1' });
    } else {
      this.filteredYear = [{ label: 'Todos', value: '-1' }];
    }
  }

  loadStatements() {
    this.productorService.getStatements.subscribe(r => {
      if (r.status) {
        // Primero ordenamos por NAME_BUSINESS alfabéticamente y luego por YEAR_STATEMENT
        const rStatement = r.data.sort((a: any, b: any) => {
          if (a.NAME_BUSINESS < b.NAME_BUSINESS) return -1;
          if (a.NAME_BUSINESS > b.NAME_BUSINESS) return 1;
          return b.YEAR_STATEMENT - a.YEAR_STATEMENT; // Ordenamos por YEAR_STATEMENT si el nombre es igual
        });

        let businessSet = new Set();
        let yearSet = new Set();
        rStatement.forEach((e: any) => {
          businessSet.add(e.CODE_BUSINESS + ' — ' + e.NAME_BUSINESS);
          if (!this.years.includes(e.YEAR_STATEMENT)) {
            this.years.push(e.YEAR_STATEMENT);
            yearSet.add(e.YEAR_STATEMENT);
          }
        });
        this.business_year = Array.from(yearSet).map(name => ({ label: name, value: name }));
        this.business_name = Array.from(businessSet).map(name => ({ label: name, value: name }));
        this.years.sort((a, b) => b - a);
        this.dbStatements = rStatement;
        this.filtered = r.data;
        this.cant = Math.ceil(this.dbStatements.length / 10);
        this.db = this.dbStatements.slice(0, 10);
      }
    });
  }

  updateFiltersBusiness(event: any) {
    let n: any; 0
    if (event && event.type == 'input') { // Esto indica que es un evento (input)
      const businessControl = this.form.get('BUSINESS');
      if (businessControl && businessControl.value) {
        n = businessControl.value;
      }
    } else { // Esto indica que es un evento (onSelect)
      n = event && event.value;
    }
    if (n == 'Todos') {
      n = -1
    }
    if (n != -1 && n != null) {
      n = n.replace(/.* — \s*/, '');
    }

    else {
      let yearSet = new Set();
      let aux = this.dbStatements.slice();
      this.dbStatements.sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT).forEach(e => {
        yearSet.add(e.YEAR_STATEMENT);
      });

      this.business_year = Array.from(yearSet).map(name => ({ label: name, value: name }));
      this.dbStatements = aux;
      return;

    }
    const tmp = this.dbStatements.filter(r => {
      if (n != '-1' && r.NAME_BUSINESS == n) {
        return r;
      }
    });

    let yearSet = new Set();
    (tmp as any[]).forEach(e => {
      yearSet.add(e.YEAR_STATEMENT);
    });

    this.business_year = Array.from(yearSet).map(name => ({ label: name, value: name }));

  }

  updateFiltersYears(event: any) {
    let n: any;
    if (event && event.type == 'input') { // Esto indica que es un evento (input)
      const businessControl = this.form.get('YEAR');
      if (businessControl && businessControl.value) {
        n = businessControl.value;
      }
    } else { // Esto indica que es un evento (onSelect)
      n = event && event.value;
    }
    if (n == 'Todos') {
      n = -1
    }
    if (n != -1 && n != null) {
      n = n.toString().replace(/.* — \s*/, '');
    }
    else {
      let yearSet = new Set();
      (this.dbStatements as any[]).forEach(e => {
        yearSet.add(e.CODE_BUSINESS + ' — ' + e.NAME_BUSINESS);
      });
      this.business_name = Array.from(yearSet).map(name => ({ label: name, value: name }));
      return;
    }
    const tmp = this.dbStatements.filter(r => {
      if (n != '-1' && r.YEAR_STATEMENT == n) {
        return r;
      }
    });

    let yearSet = new Set();
    (tmp as any[]).forEach(e => {
      yearSet.add(e.CODE_BUSINESS + ' — ' + e.NAME_BUSINESS);
    });
    this.business_name = Array.from(yearSet).map(name => ({ label: name, value: name }));
  }

  filter() {

    let n: any;
    let y: any;
    let lengthBussiness: any;
    let lengthYear: any;

    const businessControl = this.form.get('BUSINESS');
    const yearControl = this.form.get('YEAR');
    if (businessControl && businessControl.value && yearControl && yearControl.value) {
      if (businessControl.value) {
        if (typeof businessControl.value === 'string') {
          lengthBussiness = 1;
        } else {
          lengthBussiness = Object.keys(businessControl.value).length;
        }
      }

      if (yearControl.value) {
        if (typeof yearControl.value === 'string') {
          lengthYear = 1;
        } else {
          lengthYear = Object.keys(yearControl.value).length;
        }
      }
      if (lengthBussiness > 1) {
        if (lengthYear > 1) {
          n = businessControl.value.value;
          y = yearControl.value.value;
        }
        else {
          n = businessControl.value.value;
          if (yearControl.value == 'Todos') {
            y = -1;
          }
          else {
            y = yearControl.value;
          }
        }
      }
      else if (lengthYear > 1) {
        if (businessControl.value == 'Todos') {
          n = -1;
          y = yearControl.value.value;
        }
        else {
          n = businessControl.value;
          y = yearControl.value;
        }
      }
      else {
        if (businessControl.value == 'Todos') {
          n = -1;
          if (yearControl.value == 'Todos') {
            y = -1;
          }
          else {
            y = yearControl.value;
          }
        }
        else {
          if (yearControl.value == 'Todos') {
            n = businessControl.value;
            y = -1;
          }
          else {
            n = businessControl.value;
            y = yearControl.value;
          }
        }
      }

      if (n != -1) {
        n = n.toString().replace(/.* — \s*/, '');
      }

      let aux = this.business_name;
      this.business_name = this.business_name.map((business: { value: any; label: any; }) => {
        const value = business.value.replace(/.* — \s*/, '');
        const label = business.label.replace(/.* — \s*/, '');
        return { value, label };
      });
      if (n == -1 || this.business_name.some((business: { value: any; label: any; }) => business.value === n)) {
        this.business_name = aux;
        if (y != undefined && !isNaN(Number(y))) {
          this.business_name = aux;
          const tmp = this.dbStatements.filter(r => {
            if (n != '-1' && r.NAME_BUSINESS == n) {
              if (y != '-1') {
                if (r.YEAR_STATEMENT == y)
                  return r;
              } else {
                return r;
              }
            }
            if (n == '-1') {
              if (y != '-1') {
                if (r.YEAR_STATEMENT == y)
                  return r;
              } else {
                return r;
              }
            }
          });
          this.pos = 1;
          this.filtered = tmp;
          this.db = tmp.slice(0, 10).sort((a, b) => new Date(b.UPDATED_AT).getTime() - new Date(a.UPDATED_AT).getTime());
          this.cant = Math.ceil(tmp.length / 10);
          return;
        }
        else {
          this.business_name = aux;
          Swal.fire({
            title: 'Error',
            text: 'Debe ingresar un año válido.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      }
      else {
        this.business_name = aux;
        Swal.fire({
          title: 'Error',
          text: 'Debe ingresar una empresa o año válido.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    }
    else {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar empresa y año.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  reset() {
    this.loadStatements();
  }
  pagTo(i: number) {
    this.pos = i + 1;
    this.db = this.filtered.slice((i * 10), (i + 1) * 10).sort((a: any, b: any) => {
      if (a.NAME_BUSINESS < b.NAME_BUSINESS) return -1;
      if (a.NAME_BUSINESS > b.NAME_BUSINESS) return 1;
      return b.YEAR_STATEMENT - a.YEAR_STATEMENT;
    })
  }
  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.filtered.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a: any, b: any) => {
      if (a.NAME_BUSINESS < b.NAME_BUSINESS) return -1;
      if (a.NAME_BUSINESS > b.NAME_BUSINESS) return 1;
      return b.YEAR_STATEMENT - a.YEAR_STATEMENT;
    })
  }
  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.filtered.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a: any, b: any) => {
      if (a.NAME_BUSINESS < b.NAME_BUSINESS) return -1;
      if (a.NAME_BUSINESS > b.NAME_BUSINESS) return 1;
      return b.YEAR_STATEMENT - a.YEAR_STATEMENT;
    })
  }

  downloadPDF(id: any, year: any) {
    Swal.fire({
      title: 'Espere',
      text: 'Generando PDF',
      showConfirmButton: false
    });
    Swal.showLoading();
    this.productorService.downloadPDF(id, year).subscribe(r => {
      const file = new Blob([r], { type: 'application/pdf' });
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(file);
      link.download = `Reporte_${year}`;
      document.body.appendChild(link);
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      link.remove();
      window.URL.revokeObjectURL(link.href);
      Swal.close();
    });
  }

  navigateToForm(id: string) {
    this.router.navigateByUrl(`/mantenedor/productor/${id}`);
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

}
