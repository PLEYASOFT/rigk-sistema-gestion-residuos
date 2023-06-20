import { Component, OnInit } from '@angular/core';
import { RatesTsService } from '../../../../core/services/rates.ts.service';
import { ProductorService } from '../../../../core/services/productor.service';
import { Router } from '@angular/router';
import { BusinessService } from 'src/app/core/services/business.service';
import Swal from 'sweetalert2';
// import CryptoJS from "crypto-js";
// import * as CryptoJS from 'crypto-js';
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
      this.allBusiness = (r.data.business as any).sort((a:any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
      this.cant=Math.ceil(this.allBusiness.length/10);
      this.db = this.allBusiness.slice((this.pos-1)*10, this.pos*10).sort((a:any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
    })
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
    this.db = tmp.slice(0, 10).sort((a:any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
    this.cant = Math.ceil(tmp.length / 10);
  }

  reset() {
    this.loadStatements();
  }

  pagTo(i: number) {
    this.pos = i + 1;
    this.db = this.allBusiness.slice((i * 10), (i + 1) * 10).sort((a:any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
  }

  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.allBusiness.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a:any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
  }

  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.allBusiness.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a:any, b: any) => a.CODE_BUSINESS.toString().localeCompare(b.CODE_BUSINESS.toString()));
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

//1. recibe un base64 retorna bytes
  base64ToArrayBuffer = (base64: any) => {
    base64 = this.decrypt(base64);//desencripta base64
    if (base64.charAt(0) === "0") {
        base64 = base64.substring(1).replaceAll("\n", "").replaceAll(" ", "");
    }
    let binaryString = base64.atob(base64);//tenía Bae64 con mayuscula 
    let binaryLen = binaryString.length;
    let bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
        let ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
};
  // saveByteArrayPDF = (reportName:any, byte: any) => {
  //   let blob = new Blob([byte], { type: "application/pdf" }); //blob
  //   let link = document.createElement("a");
  //   link.href = window.URL.createObjectURL(blob);
  //   let fileName = reportName;
  //   link.download = fileName;
  //   link.dispatchEvent(new MouseEvent("click"));
    // setCargando(false);
    // document.body.removeChild(document.getElementById("modal-overlay")!);
    // document.body.classList.remove("modal-open");
    // document.body.style.overflow = "auto";
    // document.body.style.paddingRight = "0";
// };

  
  dowloadPdf(){
    this.productorService.downloadPDFTerminos().subscribe(r => {
      const file = new Blob([r], { type: 'application/pdf' });
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(file);
      link.download = "pdf";
      document.body.appendChild(link);
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      link.remove();
      window.URL.revokeObjectURL(link.href);
      // Swal.close();
    });
  }
  adjuntar() {
    var input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    input.onchange = function(e) {
      var target = e.target as HTMLInputElement;
      var file = target.files![0];
      if (file) {
        var path = URL.createObjectURL(file);
        console.log("Ruta de la carpeta seleccionada:", '/');
      }
    };
    document.body.appendChild(input);
    input.click();
  }


  // saveBase64AsBlob (base64, mimeType, fileName) {
  //   const byte = base64ToArrayBuffer(base64);
  //   const blob = new Blob([byte], { type: mimeType });
  // }
  
  openTermsAndConditions(){
    document.getElementById('modalDownloadPdfTerms')!.click()
    //popUp
    Swal.fire({
      title: 'Términos y condiciones',
      html: 'Debe adjuntar firmado términos y condiciones <br><br> <a href="javascript:void(0)" id="download" >Descargar términos y condiciones</a>',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Adjuntar',
      allowOutsideClick: false,
      didOpen: () => { const dW = Swal.getPopup()?.querySelector('#download');
        dW!.addEventListener('click', (r) => {r.preventDefault(); r.stopPropagation(); this.dowloadPdf() } )}
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Enviado!',
          'Su declaración fue enviada.',
          'success'
          )
        }
      })
      // document.querySelector('#download')?.addEventListener('click', (r) => {r.stopPropagation(); this.dowloadPdf() } )
      document.querySelector('#add')?.addEventListener('click', (r) => {r.stopPropagation(); this.adjuntar() } )
      
  }
  // openTermsAndConditions() {
  //   document.getElementById('modalDownloadPdfTerms')!.click();
  //   //popUp
  //   Swal.fire({
  //     title: 'Términos y condiciones',
  //     html: 'Debe adjuntar firmado términos y condiciones <br><br> <a href="javascript:void(0)" id="download" >Descargar términos y condiciones</a>',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     cancelButtonText: 'Cancelar',
  //     confirmButtonText: 'Adjuntar',
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       const dW = Swal.getPopup()?.querySelector('#download');
  //       dW!.addEventListener('click', (r) => {
  //         r.preventDefault();
  //         r.stopPropagation();
  //         this.dowloadPdf();
  //       });
  //       const addButton = Swal.getPopup()?.querySelector('#add');
  //       addButton!.addEventListener('click', (r) => {
  //         r.stopPropagation();
  //         this.adjuntar();
  //       });
  //     }
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire(
  //         'Enviado!',
  //         'Su declaración fue enviada.',
  //         'success'
  //       );
  //     }
  //   });
  // }
  
  
    
  }
  