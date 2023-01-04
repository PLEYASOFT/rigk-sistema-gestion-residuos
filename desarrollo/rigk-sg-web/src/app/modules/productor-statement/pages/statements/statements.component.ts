import { Component, OnInit } from '@angular/core';
import { ProductorService } from '../../../../core/services/productor.service';

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

  constructor(public productorService: ProductorService) { }

  ngOnInit(): void {
    this.loadStatements();

  }

  loadStatements() {
    this.productorService.getStatementByUser.subscribe(r => {
      if (r.status) {
        (r.data as any[]).forEach(e => {
          if (this.business_name.indexOf(e.NAME_BUSINESS) == -1) {
            this.business_name.push(e.NAME_BUSINESS);
          }
          if (this.years.indexOf(e.YEAR_STATEMENT) == -1) {
            this.years.push(e.YEAR_STATEMENT)
          }
        });
        this.dbStatements = r.data;
        this.db = this.dbStatements.slice(0, 10);
      }
    })
  }
  filter() {
    const n = (document.getElementById('f_name') as HTMLSelectElement).value;
    const y = (document.getElementById('f_year') as HTMLSelectElement).value;
    this.db = this.dbStatements.filter(r => {
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
    }).slice(0, 10);

  }
  reset() {
    this.loadStatements();
  }

  setArrayFromNumber(i: number) {
    this.db = this.dbStatements.slice((i * 10) - 1, (i + 1) * 10);
  }
  next() {
    if ((this.pos) * 10 > this.dbStatements.length) return;
    this.pos++;
    this.db = this.dbStatements.slice((this.pos - 1) * 10, (this.pos) * 10);
  }
  previus() {
    if (this.pos - 1 == 0) return;
    this.pos--;
    this.db = this.dbStatements.slice((this.pos - 1) * 10, (this.pos) * 10);
  }
  downloadPDF(id: any, year: any) {
    this.productorService.downloadPDF(id, year);
  }
}
