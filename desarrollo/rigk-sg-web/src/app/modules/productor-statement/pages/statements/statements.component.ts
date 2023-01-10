import { Component, OnInit } from '@angular/core';
import { ProductorService } from '../../../../core/services/productor.service';
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

  constructor(public productorService: ProductorService) { }

  ngOnInit(): void {
    this.loadStatements();
  }

  loadStatements() {
    this.productorService.getStatementByUser.subscribe(r => {
      if (r.status) {
        r.data = r.data.sort(((a:any, b:any) => b.YEAR_STATEMENT - a.YEAR_STATEMENT));
        (r.data as any[]).forEach(e => {

          if (this.business_name.indexOf(e.NAME_BUSINESS) == -1) {
            this.business_name.push(e.NAME_BUSINESS);
          }
          if (this.years.indexOf(e.YEAR_STATEMENT) == -1) {
            this.years.push(e.YEAR_STATEMENT)
          }
        });
        this.years.sort((a, b) => b - a);
        this.dbStatements = r.data;
        this.cant = Math.ceil(this.dbStatements.length / 10);
        this.db = this.dbStatements.slice(0, 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
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
    }).slice(0, 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;

  }
  reset() {
    this.loadStatements();
  }
  pagTo(i: number) {
    this.pos = i;
    this.db = this.dbStatements.slice((i * 10), (i + 1) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;
  }
  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.dbStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;
  }
  previus() {
    if (this.pos-1 <= 0 || this.pos >= this.cant+1) return;
    this.pos--;
    this.db = this.dbStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);;
  }
  downloadPDF(id: any, year: any) {
    Swal.fire({
      title: 'Espere',
      text: 'Generando PDF',
      showConfirmButton: false
    });
    Swal.showLoading();
    this.productorService.downloadPDF(id, year).subscribe(r=>{
      const file = new Blob([r], {type: 'application/pdf'});
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank', 'width=1000, height=800');
      Swal.close();
    });
  }
  setArrayFromNumber() {
    return new Array(this.cant);
  }
}
