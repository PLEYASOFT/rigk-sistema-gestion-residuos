import { Component, OnInit } from '@angular/core';
import { ProductorService } from 'src/app/core/services/productor.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ConsumerService } from '../../../../core/services/consumer.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-statements-detail',
  templateUrl: './statements-detail.component.html',
  styleUrls: ['./statements-detail.component.css']
})

export class StatementsDetailComponent implements OnInit {

  maxFiles = 3;
  userData: any | null;
  dbStatements: any[] = [];
  db: any[] = [];
  pos = 1;
  index: any = 0
  data_consulta: any = [];
  detail_consulta: any = [];
  MV_consulta: any = [];
  years: number[] = [];
  cant: number = 0;
  userForm: any;
  selectedFile: File | null = null;
  listMV = [
    { name: "Guia de despacho", value: 1 },
    { name: "Factura gestor", value: 2 },
    { name: "Registro de peso", value: 3 },
    { name: "Fotografía retiro", value: 4 },
    { name: "Balance de masas", value: 5 },
    { name: "Otro", value: 6 },
  ];
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
      MV: ["", Validators.required],
      ARCHIVO: [null, [Validators.required, this.fileTypeValidator, this.fileSizeValidator]],
    });
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
    this.ConsumerService.getFormConsulta(idHeader).subscribe(r => {
      if (r.status) {
        this.data_consulta = r.data.header[0];
        Swal.close();
      }
    })
  }

  loadDetail() {
    const idHeader = this.route.snapshot.params['id_header_'];
    const idDetail = this.route.snapshot.params['id_detail'];
    this.ConsumerService.getDeclarationByID(idHeader, idDetail).subscribe(r => {
      if (r.status) {
        this.detail_consulta = r.status[0];
        this.loadMV();
      }
    })
  }

  loadMV() {
    this.ConsumerService.getMV(this.detail_consulta.ID_DETAIL).subscribe(r => {
      if (r.status) {
        this.MV_consulta = r.data.header;
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

  saveFile() {
    this.detail_consulta.FechaRetiro = this.formatDate(this.detail_consulta.FechaRetiro);
    this.ConsumerService.saveFile(this.detail_consulta.ID_DETAIL, this.fileName, this.fileBuffer, this.userForm.controls['MV'].value).subscribe(r => {
      if (r.status) {
        Swal.fire({
          icon: 'success',
          text: 'Medio de verificación guardado satisfactoriamente'
        })
        this.loadMV();
      }
      else {
        console.log('error')
      }
    })
  }

  deleteMV(id: any) {
    this.ConsumerService.deleteById(id).subscribe(r => {
      if (r.status) {
        Swal.fire({
          icon: 'info',
          text: 'Medio de verificación eliminado satisfactoriamente'
        })
        this.loadMV();
      }
      else {
        console.log('error')
      }
    })
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
      } else if (file.size > 1 * 1024 * 1024) {
        this.userForm.controls['ARCHIVO'].setErrors({ 'invalidFileSize': true });
        this.userForm.controls['ARCHIVO'].markAsTouched();
      } else {
        this.userForm.controls['ARCHIVO'].setErrors(null);
        this.userForm.controls['ARCHIVO'].markAsTouched();
      }
    } else {
      this.selectedFile = null;
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

  maxSizeValidator(maxSize: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const file = control.value;
      if (file && file.size > maxSize) {
        return { maxSizeExceeded: true };
      }
      return null;
    };
  }

  fileTypeValidator(control: AbstractControl): { [key: string]: any } | null {
    const file = control.value;
    if (file) {
      const allowedFileTypes = ['application/pdf', 'image/jpeg'];
      if (!allowedFileTypes.includes(file.type)) {
        return { invalidFileType: true };
      }
    }
    return null;
  }

  fileSizeValidator(control: AbstractControl): { [key: string]: any } | null {
    const file = control.value;
    if (file) {
      const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB
      if (file.size > maxSizeInBytes) {
        return { invalidFileSize: true };
      }
    }
    return null;
  }
}
