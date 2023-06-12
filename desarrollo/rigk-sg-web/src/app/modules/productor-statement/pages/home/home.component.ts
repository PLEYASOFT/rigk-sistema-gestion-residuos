import { Component, OnInit } from '@angular/core';
import { RatesTsService } from '../../../../core/services/rates.ts.service';
import { ProductorService } from '../../../../core/services/productor.service';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/core/services/business.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  db: any[] = [];
  dbStatements: any[] = [];
  pos = 1;
  business_name: any[] = [];
  years: number[] = [];
  cant: number = 0;
  types = ['EyE reciclables de papel/cartón', 'EyE reciclables de metal', 'EyE reciclables de plásticos', 'EyE no reciclables'];
  year: number = (new Date().getFullYear()) - 1;
  rates: any[] = []
  // constructor(public ratesService: RatesTsService ) { }
  constructor(public productorService: ProductorService, private router: Router,  public ratesService: RatesTsService, public businessServices: BusinessService) { }

  ngOnInit(): void {
    this.loadStatements();
    this.ratesService.getRates(this.year).subscribe(resp => {
      if (resp.status) {
        resp.data.forEach((lalala: any) => {
          const name = this.types[lalala.type - 1];
          const price = lalala.price; //*precio_uf
          this.rates.push({ name, price });
        });
      }
    })
  }
  loadStatements() {
    const idUser = JSON.parse(sessionStorage.getItem('user')!).ID;
    this.businessServices.getBusinessById(idUser, this.year.toString()).subscribe(r => {
      console.log("rrrrr",r)
      this.allStatement = r.data.statements;
      this.allBusiness = (r.data.business as any).sort((a:any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
    })
    // this.productorService.getStatementByUser.subscribe(r => {
    //   if (r.status) {
    //     const currentYearMinusOne = (new Date().getFullYear()) - 1;
    //     r.data = r.data.filter((e: any) => e.YEAR_STATEMENT === currentYearMinusOne);
  
    //     (r.data as any[]).forEach(e => {
    //       if (this.business_name.indexOf(e.NAME_BUSINESS) == -1) {
    //         this.business_name.push(e.NAME_BUSINESS);
    //       }
    //     });
  
    //     this.years.push(currentYearMinusOne);
    //     this.dbStatements = r.data;
    //     this.cant = Math.ceil(this.dbStatements.length / 10);
    //     this.db = this.dbStatements.slice(0, 10).sort((a, b) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
    //   }
    // });
  }
  allStatement: any[]=[];
  allBusiness: any[]=[];

  businessById(id: string){
    const tmp = this.allStatement.find(r=>r.ID_BUSINESS==id);
    let status = "";
    let code = -1;
    if(tmp == undefined) {
        status = "No Enviado";//-1
    } else {
      code = tmp.STATE
        switch(tmp.STATE) {
            case 1:
                status = "Enviada";
                break;
            case 0:
                status = "Borrador";
                break;
            case 2:
                status = "Pendiente";
                break;
        }
    }
  return {status, code};
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
    this.db = this.dbStatements.slice((i * 10), (i + 1) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }

  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.dbStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }

  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.dbStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => b.YEAR_STATEMENT - a.YEAR_STATEMENT);
  }

  navigateToForm(id: string, year: string, id_statement: any, state: number = 0) {
    sessionStorage.setItem('state', state.toString() || '0');
    sessionStorage.setItem('id_statement', id_statement?.toString() || 'null');
    this.router.navigateByUrl(`/productor/form?year=${year}&id_business=${id}`);
  }

  setArrayFromNumber() {
    return new Array(this.cant);
  }

}
