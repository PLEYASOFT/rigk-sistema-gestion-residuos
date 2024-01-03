import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductorService } from 'src/app/core/services/productor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maintainer-productor-detail',
  templateUrl: './maintainer-productor-detail.component.html',
  styleUrls: ['./maintainer-productor-detail.component.css']
})
export class MaintainerProductorDetailComponent implements OnInit {

  listData: any = [];
  MV_consulta: any = [];
  constructor(public productorService: ProductorService,
    private route: ActivatedRoute,
    private router: Router,) { }

  ngOnInit(): void {
    this.loadData();
    this.loadMV();
  }

  loadData() {
    const id_header = this.route.snapshot.params['id_header'];
    console.log(id_header)
    this.productorService.getStatementsById(id_header).subscribe(r => {
      this.listData = r;
      console.log(this.listData)
    })
  }
  loadMV() {
    const id_header = this.route.snapshot.params['id_header'];
    this.productorService.getMV(id_header).subscribe(r => {
      if (r.status) {
        this.MV_consulta = r.data.header;
        console.log(this.MV_consulta)
      }
    });
  }
  downloadFile(fileId: number, fileName: string) {
    this.productorService.downloadMV(fileId).subscribe(
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
  descargarOC(idHeader: number){
    this.productorService.downloadOC(idHeader).subscribe({
      next: (r) => {
        if (r) {
          const file = new Blob([r], { type: 'application/pdf' });
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(file);
          link.download = `Orden_de_Compra_${this.listData.data[0].YEAR_STATEMENT}`;
          document.body.appendChild(link);
          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          link.remove();
          window.URL.revokeObjectURL(link.href);
        }
      },
      error: r => {
        Swal.fire({
          icon: 'error',
          text: 'error'
        })
      }
    })
  }

  isDownloadOCEnabled(): boolean {
    return this.listData.data && this.listData.data.length > 0 && this.listData.data[0].STATE === 1;
  }

  isEstadoPendiente(): boolean {
    return this.listData.data && this.listData.data.length > 0 && this.listData.data[0].STATE === 2;
  }

  isEstadoBorrador(): boolean {
    return this.listData.data && this.listData.data.length > 0 && this.listData.data[0].STATE === 0;
  }

  isEstadoEnviado(): boolean {
    return this.listData.data && this.listData.data.length > 0 && this.listData.data[0].STATE === 1;
  }
  volver() {
    this.router.navigate(['/mantenedor/productor']);
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

  cambiarAEstadoPendiente(){
    const id_header = this.route.snapshot.params['id_header'];
  
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Está seguro de cambiar a estado Pendiente? La Orden de Compra actual se eliminará del sistema y el usuario tendrá un plazo de 7 días para subir una nueva Orden de Compra. Pasado este plazo, la declaración volverá a estado borrador y se recalculará el valor de la UF',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productorService.updateToPending(id_header).subscribe(r => {
          if (r.status) {
            Swal.fire(
              'Cambiado!',
              'El estado ha sido cambiado a Pendiente.',
              'success'
            ).then(() => {
              this.loadData();
            });
          } else {
            Swal.fire(
              'Error!',
              'Hubo un problema al cambiar el estado.',
              'error'
            );
          }
        }, error => {
          Swal.fire(
            'Error!',
            'Hubo un problema al cambiar el estado.',
            'error'
          );
        });
      }
    });
  }

  cambiarAEstadoBorrador() {
    const id_header = this.route.snapshot.params['id_header'];
  
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Está seguro de cambiar a estado Borrador? La Orden de Compra se eliminará del sistema y los valores de la declaración se actualizarán al valor de la UF de hoy',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productorService.updateToDraft(id_header).subscribe(r => {
          if (r.status) {
            Swal.fire(
              'Cambiado!',
              'El estado ha sido cambiado a Borrador.',
              'success'
            ).then(() => {
              this.loadData();
            });
          } else {
            Swal.fire(
              'Error!',
              'Hubo un problema al cambiar el estado.',
              'error'
            );
          }
        }, error => {
          Swal.fire(
            'Error!',
            'Hubo un problema al cambiar el estado.',
            'error'
          );
        });
      }
    });
  }
  
}
