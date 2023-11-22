import { Component, OnInit } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
import { ConsumerService } from 'src/app/core/services/consumer.service';
import { LogsService } from 'src/app/core/services/logs.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import { RatesTsService } from 'src/app/core/services/rates.ts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maintainer-declarations-ci',
  templateUrl: './maintainer-declarations-ci.component.html',
  styleUrls: ['./maintainer-declarations-ci.component.css']
})
export class MaintainerDeclarationsCiComponent implements OnInit {

  ngOnInit(): void {
  }

  years: number[] = [];
  selectedYear: number = -1;
  listBusiness: any[] = [];
  listStatements: any[] = [];
  filteredListBusiness: any[] = [];
  //Automatizado para años posteriores
  constructor(private businesService: BusinessService,
    public productorService: ProductorService,
    public consumerService: ConsumerService,
    public ls: LogsService,
    public ratesService: RatesTsService) {
    const currentYear = new Date().getFullYear();
    for (let year = 2022; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  getAllBusiness() {
    this.businesService.getAllBusiness().subscribe({
      next: resp => {
        this.listBusiness = resp.status;
      },
      error: r => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          text: r.msg,
          title: '¡Ups!'
        });
      }
    });
  }

  loadStatements(year: any) {
    this.productorService.getAllStatementByYear(year).subscribe(r => {
      if (r.status) {
        this.listStatements = r.data.res_business.sort((a: { STATE: number; ID_BUSINESS: number; }, b: { STATE: number; ID_BUSINESS: number; }) => {
          if (a.STATE === b.STATE) {
            return a.ID_BUSINESS - b.ID_BUSINESS;
          } else {
            return b.STATE - a.STATE;
          }
        });
        this.filteredListBusiness = this.listBusiness.filter(business => {
          return !this.listStatements.some(statement => statement.ID_BUSINESS === business.ID);
        });
      }
    })
  }

  allUF: any[] = [];

  generarExcel() {

    const y = parseInt((document.getElementById('f_year') as HTMLSelectElement).value);
    
    Swal.fire({
      title: 'Generando Excel',
      text: 'Esto puede tardar varios minutos',
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });

    Swal.showLoading();
    this.consumerService.downloadExcelDeclarationCI(y).subscribe({
      next: r => {
        if (r) {
          const file = new Blob([r], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(file);
          link.download = `Declaraciones_CI_${y}`;
          document.body.appendChild(link);
          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          link.remove();
          window.URL.revokeObjectURL(link.href);
          Swal.close();
        }
      },
      error: r => {
        Swal.fire({
          icon: 'error',
          text: 'Ha sucedido un error al generar el archivo Excel, por favor pruebe de nuevo en unos minutos. Si el problema persiste póngase en contacto con administración'
        })
      }
    });
  }
}

