import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
import { EstablishmentService } from 'src/app/core/services/establishment.service';
import Swal from 'sweetalert2';
import { ConsumerService } from '../../../../core/services/consumer.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
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

  onFileChange(event: any) {
    const allowedMimeTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      Swal.fire({
        icon: 'error',
        text: 'Solo puede cargar un archivo a la vez'
      });
      return;
    }

    const file = target.files[0];
    if (!allowedMimeTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        text: 'Tipo de archivo incorrecto. Por favor, cargue un archivo Excel (.xls o .xlsx)'
      });
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      if (!wb.SheetNames.includes('Carga Masiva')) {
        Swal.fire({
          icon: 'error',
          text: 'No se encontró la hoja "Carga Masiva" en el archivo'
        });
        return;
      }
      const ws: XLSX.WorkSheet = wb.Sheets['Carga Masiva'];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.processData(data);
    };
    reader.readAsBinaryString(file);
  }

  async processData(data: any[]) {
    const rows = data.slice(1);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const excelRowNumber = i + 2; // Se agrega 2 para considerar el encabezado y el índice base 1 de Excel

      // Código de establecimiento
      const establishmentCode = row[0];
      const establishmentId = establishmentCode.split(" - ")[0];
      if (!establishmentCode) {
        Swal.fire({
          icon: 'error',
          text: `Código de establecimiento no proporcionado en la fila ${excelRowNumber}`
        });
        return;
      }
      // Fecha
      const date = this.excelSerialDateToJSDate(row[1]);
      if (!date || !this.isValidDate(date)) {
        Swal.fire({
          icon: 'error',
          text: `Fecha no válida o no proporcionada en la fila ${excelRowNumber}. Formato requerido: DD/MM/AAAA`
        });
        return;
      }
      // Número de guía de despacho
      const dispatchGuideNumber = row[2];
      if (!dispatchGuideNumber) {
        Swal.fire({
          icon: 'error',
          text: `Número de guía de despacho no proporcionado en la fila ${excelRowNumber}`
        });
        return;
      }
      // Tipo de tratamiento
      const treatmentType = row[3];
      if (!treatmentType) {
        Swal.fire({
          icon: 'error',
          text: `Tipo de tratamiento no proporcionado en la fila ${excelRowNumber}`
        });
        return;
      }
      // Tipo de residuo
      const wasteType = row[4];
      if (!wasteType) {
        Swal.fire({
          icon: 'error',
          text: `Tipo de residuo no proporcionado en la fila ${excelRowNumber}`
        });
        return;
      }
      // Tipo específico
      const specificType = row[5];
      if (!specificType) {
        Swal.fire({
          icon: 'error',
          text: `Tipo específico no proporcionado en la fila ${excelRowNumber}`
        });
        return;
      }
      // LER
      const LER = row[6];
      // Gestor
      const managerName = row[7];
      if (!managerName) {
        Swal.fire({
          icon: 'error',
          text: `Nombre del gestor no proporcionado en la fila ${excelRowNumber}`
        });
        return;
      }
      // RUT Gestor
      const managerRUT = row[8];
      if (!managerRUT) {
        Swal.fire({
          icon: 'error',
          text: `RUT de gestor no proporcionado en la fila ${excelRowNumber}`
        });
        return;
      }
      const businessResponse = await this.businessService.getBusinessByVAT(managerRUT).toPromise();
      if (!businessResponse.status) {
        Swal.fire({
          icon: 'error',
          text: `RUT de gestor no encontrado en la fila ${excelRowNumber}`
        });
        return;
      }
      const businesses = businessResponse.status;
      if (!Array.isArray(businesses)) {
        Swal.fire({
          icon: 'error',
          text: `Error inesperado al buscar gestor en la fila ${excelRowNumber}`
        });
        return;
      }
      let isValidEstablishmentBusinessRelation = false;
      for (const business of businesses) {
        const checkRelationResponse = await this.businessService.checkEstablishmentBusinessRelation(establishmentId, business.ID).toPromise();
        if (checkRelationResponse.status) {
          isValidEstablishmentBusinessRelation = true;
          break;
        }
      }
      if (!isValidEstablishmentBusinessRelation) {
        Swal.fire({
          icon: 'error',
          text: `No se encontró un gestor con el material y región requeridos en la fila ${excelRowNumber}`
        });
        return;
      }
      // Código de establecimiento receptor
      const receivingEstablishmentCode = row[9];
      // Código de tratamiento receptor
      const receivingTreatmentCode = row[10];
      // Cantidad
      const quantity = row[11];
      if (!quantity || !this.isValidQuantity(quantity)) {
        Swal.fire({
          icon: 'error',
          text: `Cantidad no válida o no proporcionada en la fila ${excelRowNumber}. Asegúrese de usar una coma como separador de decimales`
        });
        return;
      }
    }
  }

  isValidDate(date: string): boolean {
    const datePattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = date.match(datePattern);
    if (!match) {
      return false;
    }

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    const dateObject = new Date(year, month - 1, day);
    return (
      dateObject.getFullYear() === year &&
      dateObject.getMonth() + 1 === month &&
      dateObject.getDate() === day
    );
  }

  isValidQuantity(quantity: string): boolean {
    const quantityPattern = /^\d+(\,\d{1,2})?$/;
    return quantityPattern.test(quantity);
  }

  excelSerialDateToJSDate(serialDate: number): string {
    const startDate = new Date(1899, 11, 30);
    const jsDate = new Date(startDate.getTime() + serialDate * 24 * 60 * 60 * 1000);
    const day = jsDate.getDate();
    const month = jsDate.getMonth() + 1;
    const year = jsDate.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
