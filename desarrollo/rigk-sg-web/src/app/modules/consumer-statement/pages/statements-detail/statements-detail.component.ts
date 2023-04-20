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
        Swal.close();
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

  addManager(id: any) {

  }

  deleteManager(id: any) {

  }

  allowedFileTypes(allowedExtensions: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value) {
        const file = control.value as File;
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
        const isValid = allowedExtensions.includes(fileExtension);
        return isValid ? null : { invalidFileType: { value: control.value } };
      }
      return null;
    };
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
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
        this.userForm.patchValue({ ARCHIVO: this.selectedFile });
      }
  
    } else {
      this.selectedFile = null;
      this.userForm.patchValue({ ARCHIVO: null });
    }
  }  

  validateFileType() {
    if (this.selectedFile) {
      const fileName = this.selectedFile.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
      const isValid = ['pdf', 'jpeg', 'jpg'].includes(fileExtension);
      if (isValid) {
        this.userForm.controls['ARCHIVO'].setErrors(null);
      } else {
        this.userForm.controls['ARCHIVO'].setErrors({ invalidFileType: true });
      }
    } else {
      this.userForm.controls['ARCHIVO'].setErrors({ required: true });
    }
  }
  
}
