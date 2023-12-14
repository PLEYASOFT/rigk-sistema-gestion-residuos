import { Component, OnInit } from '@angular/core';
import { ProductorService } from 'src/app/core/services/productor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ConsumerService } from '../../../../core/services/consumer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-visualizar-mv-detail',
  templateUrl: './visualizar-mv-detail.component.html',
  styleUrls: ['./visualizar-mv-detail.component.css']
})
export class VisualizarMvDetailComponent implements OnInit {

  userData: any | null;
  data_consulta: any = [];
  detail_consulta: any = [];
  MV_consulta: any = [];
  userForm: any;
  isLoading: boolean = true;
  pendingCalls = 0;
  attached: any[] = [];
  constructor(public productorService: ProductorService,
    private ConsumerService: ConsumerService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.loadData();
    this.loadDetail();
  }

  loadData() {
    Swal.fire({
      title: 'Cargando Datos',
      text: 'Se están recuperando datos',
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    const idHeader = this.route.snapshot.params['id_header_'];
    this.pendingCalls++;
    this.ConsumerService.getFormConsulta(idHeader).subscribe(r => {
      if (r.status) {
        this.data_consulta = r.data.header[0];
      }
      this.pendingCalls--;
      if (this.pendingCalls === 0) {
        this.isLoading = false;
      }
      Swal.close();
    });
  }

  loadDetail() {
    const idHeader = this.route.snapshot.params['id_header_'];
    const idDetail = this.route.snapshot.params['id_detail'];
    this.pendingCalls++;
    this.ConsumerService.getDeclarationByID(idHeader, idDetail).subscribe(r => {
      if (r.status) {
        this.detail_consulta = r.status[0];
        this.loadMV();
      }
      this.pendingCalls--;
      if (this.pendingCalls === 0) {
        this.isLoading = false;
      }
    });
  }

  loadMV() {
    this.pendingCalls++;
    this.ConsumerService.getMV(this.detail_consulta.ID_DETAIL).subscribe(r => {
      if (r.status) {
        this.MV_consulta = r.data.header;
      }
      this.pendingCalls--;
      if (this.pendingCalls === 0) {
        this.isLoading = false;
      }
    });
  }

  volver() {
    this.router.navigate(['/mantenedor/visualizar-mv']);
  }

  formatValue(value: number): string {
    if (value === undefined || value === null) {
      return "";
    }
    if (value % 1 === 0) {
      return value.toString();
    } else {
      return value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

  downloadFile(fileId: number, fileName: string) {
    this.ConsumerService.downloadMV(fileId).subscribe(
      (data) => {
        const blob = new Blob([data], { type: data.type });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);
      }
    );
  }

}
