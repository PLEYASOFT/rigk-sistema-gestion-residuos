import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
import { EstablishmentService } from 'src/app/core/services/establishment.service';
import Swal from 'sweetalert2';
import { ConsumerService } from '../../../../core/services/consumer.service';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  dbBusiness: any[] = [];
  userData: any;

  constructor(public consumer: ConsumerService,
    public businessService: BusinessService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.loadStatements();
    localStorage.removeItem('statementsState');
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

    this.resetFileInput();
  }

  resetFileInput() {
    this.fileInput.nativeElement.value = '';
  }

  async processData(data: any[]) {
    const rows = data.slice(1);
    const rowsData = [];
    let businessId: any;
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
          businessId = business.ID;
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

      const precedenceNumber = this.convertPrecedence(row[4]);
      const typeResidueNumber = this.convertTypeResidue(row[5]);
      const treatmentTypeNumber = this.convertTreatmentType(row[3]);

      const rowData = {
        establishmentId,
        date,
        precedence: precedenceNumber,
        typeResidue: typeResidueNumber,
        quantity,
        LER,
        treatmentType: treatmentTypeNumber,
        businessId: businessId
      };
      rowsData.push(rowData);
    }

    // Obten el ID del usuario de la variable de sesión
    const userId = this.userData.ID;

    // Obten la fecha actual
    const currentDate = new Date().toISOString().replace('T', ' ').replace('Z', '');

    for (const rowData of rowsData) {
      // Obten el año de la fecha proporcionada en el Excel
      const year = rowData.date.split('/')[2];

      const headerFormData = {
        establishmentId: rowData.establishmentId,
        createdBy: userId,
        createdAt: currentDate,
        updatedAt: currentDate,
        yearStatement: year
      };
      this.consumer.saveHeaderFromExcel(headerFormData).subscribe((headerResponse: any) => {
        if (headerResponse.status) {
          const headerId = headerResponse.data.header.insertId;
          // Ahora crea la información de detalle del formulario y guarda los datos en la tabla detail_industrial_consumer_form
          const detailFormData = {
            ID_HEADER: headerId,
            PRECEDENCE: rowData.precedence,
            TYPE_RESIDUE: rowData.typeResidue,
            VALUE: parseFloat(rowData.quantity),
            DATE_WITHDRAW: this.convertDate(rowData.date),
            ID_GESTOR: rowData.businessId,
            LER: rowData.LER,
            TREATMENT_TYPE: rowData.treatmentType,
          };
          this.consumer.saveDetailFromExcel(detailFormData).subscribe((detailResponse: any) => {
            if (!detailResponse.status) {
              Swal.fire({
                icon: 'error',
                text: 'Hubo un problema al guardar los datos en la tabla detail_industrial_consumer_form'
              });
              return;
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Hubo un problema al guardar los datos en la tabla header_industrial_consumer_form'
          });
          return;
        }
        Swal.fire({
          icon: 'success',
          text: 'Se ha subido el archivo Excel correctamente y los datos se han guardado en la base de datos'
        });
      });
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

  convertPrecedence(precedence: any): number {
    switch (precedence) {
      case 'PapelCartón':
        return 0;
      case 'Metal':
        return 1;
      case 'Plástico':
        return 2;
      case 'Madera':
        return 3;
      default:
        return -1; // Retornar un valor no válido en caso de que no haya coincidencia
    }
  }

  convertTypeResidue(typeResidue: any): number {
    switch (typeResidue) {
      case "Papel":
        return 1;
      case "Papel Compuesto (cemento)":
        return 2;
      case "Caja Cartón":
        return 3;
      case "Papel/Cartón Otro":
        return 4;
      case "Envase Aluminio":
        return 5;
      case "Malla o Reja (IBC)":
        return 6;
      case "Envase Hojalata":
        return 7;
      case "Metal Otro":
        return 8;
      case "Plástico Film Embalaje":
        return 9;
      case "Plástico Envases Rígidos (Incl. Tapas)":
        return 10;
      case "Plástico Sacos o Maxisacos":
        return 11;
      case "Plástico EPS (Poliestireno Expandido)":
        return 12;
      case "Plástico Zuncho":
        return 13;
      case "Plástico Otro":
        return 14;
      case "Caja de Madera":
        return 15;
      case "Pallet de Madera":
        return 16;
      default:
        throw new Error(`Tipo de residuo no válido: ${typeResidue}`);
    }
  }

  convertTreatmentType(treatmentType: any): number {
    switch (treatmentType) {
      case "Reciclaje Mecánico":
        return 1;
      case "Valorización Energética":
        return 2;
      case "Disposición Final en RS":
        return 3;
      default:
        throw new Error(`Tipo de tratamiento no válido: ${treatmentType}`);
    }
  }

  convertDate(dateString: any) {
    const dateParts = dateString.split('/');
    return `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
  }
}
