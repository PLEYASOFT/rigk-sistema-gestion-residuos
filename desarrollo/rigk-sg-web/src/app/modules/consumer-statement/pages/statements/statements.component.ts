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

  dbStatements: any[] = [];
  db: any[] = [];
  pos = 1;

  business_name: any[] = [];
  years: number[] = [];
  cant: number = 0;

  constructor(public productorService: ProductorService,
    private establishmentService: EstablishmentService) { }

  ngOnInit(): void {
    this.loadStatements();
  }

  loadStatements() {
    this.establishmentService.getDeclarationEstablishment().subscribe(r => {
      if (r.status) {
        r.status = r.status.sort(((a: any, b: any) => b.YEAR_STATEMENT - a.YEAR_STATEMENT));
        (r.status as any[]).forEach(e => {

          if (this.business_name.indexOf(e.NAME_BUSINESS) == -1) {
            this.business_name.push(e.NAME_BUSINESS);
          }
          if (this.years.indexOf(e.YEAR_STATEMENT) == -1) {
            this.years.push(e.YEAR_STATEMENT)
          }
        });
        this.years.sort((a, b) => b - a);
        this.dbStatements = r.status;
        this.cant = Math.ceil(this.dbStatements.length / 10);
        this.db = this.dbStatements.slice(0, 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
      }
    })
  }

  filter() {
    const n = (document.getElementById('f_name') as HTMLSelectElement).value;
    const y = (document.getElementById('f_year') as HTMLSelectElement).value;
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
    this.db = tmp.slice(0, 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
    this.cant = Math.ceil(tmp.length / 10);
  }
  reset() {
    this.loadStatements();
  }
  pagTo(i: number) {
    this.pos = i + 1;
    this.db = this.dbStatements.slice((i * 10), (i + 1) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;
  }
  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.dbStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;
  }
  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.dbStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;
  }
  setArrayFromNumber() {
    return new Array(this.cant);
  }
}
