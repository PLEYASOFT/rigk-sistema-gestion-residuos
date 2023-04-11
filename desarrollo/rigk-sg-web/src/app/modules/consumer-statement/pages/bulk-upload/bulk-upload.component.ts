import { Component, OnInit } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
import { EstablishmentService } from 'src/app/core/services/establishment.service';
import Swal from 'sweetalert2';
import { ConsumerService } from '../../../../core/services/consumer.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
  dbBusiness: any[] = [];

  constructor(public consumer: ConsumerService,
    public businessService: BusinessService) { }

  ngOnInit(): void {
    this.loadStatements();
  }

  downloadExcel() {
    const id = (document.getElementById('f_name') as HTMLInputElement).value
    if (id == "-1") {
      Swal.fire({
        icon: 'error',
        text: 'Debe seleccionar empresa'
      });
      return;
    }
    this.consumer.downloadExcel(id).subscribe(r => {
      const file = new Blob([r], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(file);
      link.download = `carga masiva`;
      document.body.appendChild(link);
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      link.remove();
      window.URL.revokeObjectURL(link.href);
    });
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
    this.businessService.getBusinessByUser.subscribe(r => {

      if (r.status) {
        this.dbBusiness = r.data;
        Swal.close();
      }
    });
  }
}
