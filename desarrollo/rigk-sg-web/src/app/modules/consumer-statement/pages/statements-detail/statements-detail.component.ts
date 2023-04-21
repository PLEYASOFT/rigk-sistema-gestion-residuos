import { Component, OnInit } from '@angular/core';
import { EstablishmentService } from 'src/app/core/services/establishment.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ConsumerService } from '../../../../core/services/consumer.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

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
  index: any = 0
  data_consulta: any = [];
  detail_consulta: any = [];
  years: number[] = [];
  cant: number = 0;
  userForm: any;
  selectedFile: File | null = null;
  listMV: any[] = ['Guia de despacho', 'Factura gestor', 'Registro de peso', 'Fotografía Retiro', 'Otro'];
  attached: any[] = [];
  fileName = '';
  fileBuffer: any;
  constructor(public productorService: ProductorService,
    private ConsumerService: ConsumerService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.loadData();
    this.loadDetail();
    this.userForm = this.fb.group({
      MV: ["", [Validators.required]], // Campo requerido
      ARCHIVO: ["", [Validators.required]],
    });
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
      }
    })
  }

  volver() {
    this.router.navigate(['/consumidor/statements']);
  }

  reset() {
    this.userForm.reset();
    this.userForm.patchValue({
      MV: "",
      ARCHIVO: ""
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  saveFile() {
   
    this.detail_consulta.FechaRetiro = this.formatDate(this.detail_consulta.FechaRetiro);
    this.ConsumerService.saveFile(this.data_consulta.IDEstablecimiento, this.detail_consulta.CREATED_BY, this.detail_consulta.YEAR_STATEMENT, this.detail_consulta.ID_HEADER,
       this.detail_consulta.PRECEDENCE, this.detail_consulta.TYPE_RESIDUE, this.detail_consulta.VALUE, this.detail_consulta.FechaRetiro, this.detail_consulta.IdGestor, this.detail_consulta.ID_DETAIL, this.fileName, this.fileBuffer, 1).subscribe(r => {
        
        if (r.status) {
          Swal.fire({
            icon: 'success',
            text: 'Medio de verificación guardado satisfactoriamente'
          })
      }
      else{
        console.log('error')
      }
    })
  }


  deleteManager(id: any) {

  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName = file.name;
      this.fileBuffer = file;
      this.selectedFile = input.files[0];
  
      const allowedExtensions = ['pdf', 'jpeg', 'jpg'];
      const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase() || '';
      const isValid = allowedExtensions.includes(fileExtension);
  
      if (!isValid) {
        this.userForm.controls['ARCHIVO'].setErrors({ 'invalidFileType': true });
        this.userForm.controls['ARCHIVO'].markAsTouched();
      } else {
        this.userForm.controls['ARCHIVO'].setErrors(null);
        this.userForm.controls['ARCHIVO'].markAsTouched();
      }
    } else {
      this.selectedFile = null;
    }
  }
  
  
}
