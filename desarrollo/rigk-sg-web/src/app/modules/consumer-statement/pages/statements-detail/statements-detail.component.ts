import { Component, OnInit } from '@angular/core';
import { EstablishmentService } from 'src/app/core/services/establishment.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ConsumerService } from '../../../../core/services/consumer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-statements-detail',
  templateUrl: './statements-detail.component.html',
  styleUrls: ['./statements-detail.component.css']
})

export class StatementsDetailComponent implements OnInit {

  userData: any | null;
  dbStatements: any[] = [];
  db: any[] = [];
  pos = 1;

  data_consulta: any = [];
  detail_consulta: any = [];
  years: number[] = [];
  cant: number = 0;

  constructor(public productorService: ProductorService,
    private establishmentService: EstablishmentService,
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
      text: 'Se está recuperando datos',
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    console.log(this.route.snapshot.params)
    const idHeader = this.route.snapshot.params['id_header_'];
    console.log(idHeader)
    this.ConsumerService.getFormConsulta(idHeader).subscribe(r => {
      if (r.status) {
        this.data_consulta = r.data.header[0];
        console.log(this.data_consulta)
        Swal.close();
      }
    })
  }

  loadDetail() {
    const idHeader = this.route.snapshot.params['id_header_'];
    const idDetail = this.route.snapshot.params['id_detail'];
    this.ConsumerService.getDeclarationByID(idHeader, idDetail).subscribe(r => {
      if (r.status) {
        
        console.log(r)
        this.detail_consulta = r.status[0];
        Swal.close();
      }
    })
  }
  
  volver() {
    this.router.navigate(['/consumidor/statements']);
  }
}
