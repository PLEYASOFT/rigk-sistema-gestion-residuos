import { Component, OnInit } from '@angular/core';
import { RatesTsService } from '../../../../core/services/rates.ts.service';
import { ProductorService } from '../../../../core/services/productor.service';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/core/services/business.service';
import Swal from 'sweetalert2';
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
  rates: any[] = [];
  file: any;
  // constructor(public ratesService: RatesTsService ) { }
  constructor(public productorService: ProductorService, private router: Router, public ratesService: RatesTsService, public businessServices: BusinessService) { }

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
    //verificar si inicie sesión
    const isLoggedIn = sessionStorage.getItem('user');
    if (isLoggedIn) {
      this.openTermsAndConditions();
    }
  }
  loadStatements() {
    const idUser = JSON.parse(sessionStorage.getItem('user')!).ID;
    this.businessServices.getBusinessById(idUser, this.year.toString()).subscribe(r => {
      this.allStatement = r.data.statements;
      this.allBusiness = (r.data.business as any).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
      this.cant = Math.ceil(this.allBusiness.length / 10);
      this.db = this.allBusiness.slice((this.pos - 1) * 10, this.pos * 10).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
    })
  }
  allStatement: any[] = [];
  allBusiness: any[] = [];

  businessById(id: string) {
    const tmp = this.allStatement.find(r => r.ID_BUSINESS == id);
    let status = "";
    let code = -1;
    if (tmp == undefined) {
      status = "No Enviado";//-1
    } else {
      code = tmp.STATE
      switch (tmp.STATE) {
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
    return { status, code };
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
    this.db = tmp.slice(0, 10).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
    this.cant = Math.ceil(tmp.length / 10);
  }

  reset() {
    this.loadStatements();
  }

  pagTo(i: number) {
    this.pos = i + 1;
    this.db = this.allBusiness.slice((i * 10), (i + 1) * 10).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
  }

  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.allBusiness.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
  }

  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.allBusiness.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a: any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
  }

  navigateToForm(id: string, year: string, id_statement: any, state: number = 0) {
    sessionStorage.setItem('state', state.toString() || '0');
    sessionStorage.setItem('id_statement', id_statement?.toString() || 'null');
    this.router.navigateByUrl(`/productor/form?year=${year}&id_business=${id}`);
  }

  setArrayFromNumber() {
    return new Array(this.cant);
  }
  decrypt = (Base64: string) => {
    const bytesDescifrados: Uint8Array = Buffer.from(Base64, 'base64');
    const textoDescifrado: string = Buffer.from(bytesDescifrados).toString('utf-8');
    return textoDescifrado;
  }

  logout() {
    this.router.navigate(['/auth/login'], { queryParams: { logout: true } });
  }

  dowloadPdf() {
    this.productorService.downloadPDFTerminos().subscribe(r => {
      const blob = new Blob([r], { type: r.type });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = "Declaracion Jurada.pdf";
      link.click();

      window.URL.revokeObjectURL(url);
    });
  }

  adjuntar() {
    var input = document.createElement('input');
    input.type = 'file';
    // input.accept = 'application/pdf';
    input.style.display = 'none';
    input.onchange = (e) => {
      var target = e.target as HTMLInputElement;
      let _file = target.files![0];
      if (_file && _file.type === 'application/pdf' && _file.size / 1000 <= 1000) {
        this.file = _file;
        this.productorService.uploadPDFTerminos(_file).subscribe({
          next: (res) => {
            if (res.status) {
              document.getElementById("modal_terminos_close")!.click();
            }
          }
        });
      } else {
        Swal.fire({
          icon: 'info',
          text: 'El archivo debe ser PDF y debe pesar menos de 1MB'
        })
      }
    }
    document.body.appendChild(input);
    input.click();
  }
  openTermsAndConditions() {
    this.productorService.veryfyPDFTerminos().subscribe((res) => {
      if (!res.status) {
        document.getElementById('modalDownloadPdfTerms')!.click()
      }
    });
  }
  downloadPdfFirma() {
    this.productorService.veryfyPDFTerminos().subscribe(r => { }
    )
  }
}