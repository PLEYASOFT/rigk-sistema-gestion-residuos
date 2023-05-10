import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
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
  userData: any;

  wasteTypes: any = {
    'PapelCartón': ['Papel', 'Papel Compuesto (cemento)', 'Caja Cartón', 'Papel/Cartón Otro'],
    'Metal': ['Envase Aluminio', 'Malla o Reja (IBC)', 'Envase Hojalata', 'Metal Otro'],
    'Plástico': ['Plástico Film Embalaje', 'Plástico Envases Rígidos (Incl. Tapas)', 'Plástico Sacos o Maxisacos', 'Plástico EPS (Poliestireno Expandido)', 'Plástico Zuncho', 'Plástico Otro'],
    'Madera': ['Caja de Madera', 'Pallet de Madera']
  };
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
    this.consumer.downloadExcel(id).subscribe({
      next: r => {
        if (r) {
          const file = new Blob([r], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(file);
          link.download = `carga masiva`;
          document.body.appendChild(link);
          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          link.remove();
          window.URL.revokeObjectURL(link.href);
        }
      },
      error: r => {
        Swal.fire({
          icon: 'error',
          text: 'Revise establecimientos de la empresa. En caso de ser necesario, contacte al administrador del sistema.'
        })
      }
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
    if (data.length == 0) {
      Swal.fire({
        icon: 'error',
        text: 'Archivo inválido. No tiene todas las columnas necesarias'
      });
      return;
    }
    const rows = data.slice(1).filter(row => row.length > 0 && row.some((item: any) => item));
    const rowsData = [];
    let businessId: any;
    if (data[0].length != 12) {
      Swal.fire({
        icon: 'error',
        text: 'Archivo inválido. No tiene todas las columnas necesarias'
      });
      return;
    }
    if (rows.length == 0) {
      Swal.fire({
        icon: 'info',
        text: 'Archivo está vacío (faltan campos por rellenar).'
      });
      return;
    }
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const excelRowNumber = i + 2; // Se agrega 2 para considerar el encabezado y el índice base 1 de Excel

      if (row.length == 0 && i == 0) {
        Swal.fire({
          icon: 'error',
          text: 'Archivo vacío'
        });
        return;
      }

      for (let j = i + 1; j < rows.length; j++) {
        const w = rows[j];
        if (w[0] === row[0] && w[3] === row[3] && w[4] === row[4] && w[5] === row[5] && w[1] === row[1]) {
          Swal.fire({
            icon: 'info',
            text: 'Mismo establecimiento, tratamiento, material, subtipo y gestor para esta fecha'
          });
          return;
        }
      }

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

      const date = row[1];
      const validationResult = this.isValidDate(date);
      if (!validationResult.valid) {
        Swal.fire({
          icon: 'error',
          text: `Error en la fila ${excelRowNumber}. ${validationResult.message}`
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

      // Buscar el tipo específico en los valores de wasteTypes
      const materialType = Object.keys(this.wasteTypes).find((key:any) => this.wasteTypes[key].includes(specificType));

      if (!materialType) {
        Swal.fire({
          icon: 'error',
          text: `El tipo específico '${specificType}' no coincide con ningún material en la fila ${excelRowNumber}`
        });
        return;
      }

      if (materialType !== wasteType) {
        Swal.fire({
          icon: 'error',
          text: `El tipo de residuo '${wasteType}' no corresponde con el material '${specificType}' en la fila ${excelRowNumber}`
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
      const tmp = (managerRUT.toString().split("-"));
      if (tmp.length != 2 || tmp[1] == '') {
        Swal.fire({
          icon: 'error',
          text: `RUT no válido en la fila ${excelRowNumber}, el formato correcto es sin puntos y con guion`
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
        const checkRelationResponse = await this.businessService.checkEstablishmentBusinessRelation(establishmentId, business.ID, specificType).toPromise();
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
      if (!quantity || !this.isValidQuantity(quantity.toString().replace(".", ","))) {
        Swal.fire({
          icon: 'error',
          text: `Cantidad no válida o no proporcionada en la fila ${excelRowNumber}. Asegúrese de usar una coma como separador de decimales`
        });
        return;
      }


      const precedenceNumber = this.convertPrecedence(row[4]);
      if (precedenceNumber == -1) {
        Swal.fire({
          icon: 'error',
          text: `Tipo de Material no válido en fila: ${excelRowNumber}`
        });
        return;
      }
      const typeResidueNumber = this.convertTypeResidue(row[5]);
      if (typeResidueNumber == -1) {
        Swal.fire({
          icon: 'error',
          text: `Tipo de residuo no válido en fila: ${excelRowNumber}`
        });
        return;
      }
      const treatmentTypeNumber = this.convertTreatmentType(row[3]);
      if (treatmentTypeNumber == -1) {
        Swal.fire({
          icon: 'error',
          text: `Tipo de tratamiento no válido en fila: ${excelRowNumber}`
        });
        return;
      }
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
            VALUE: parseFloat(rowData.quantity.toString().replace(",", ".")),
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

  isValidDate(dateString: string): { valid: boolean; message: string } {
    const dateParts = dateString.split("/");

    if (dateParts.length !== 3 || isNaN(+dateParts[0]) || isNaN(+dateParts[1]) || isNaN(+dateParts[2])) {
      return { valid: false, message: "El formato de la fecha es incorrecto. Formato requerido: DD/MM/AAAA" };
    }

    const dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
    const now = new Date();

    // Elimina la hora de la fecha actual, para que sólo se compare la fecha.
    now.setHours(0, 0, 0, 0);

    if (dateObject > now) {
      return { valid: false, message: "La fecha no debe ser futura." };
    }

    if (dateObject.getDate() !== +dateParts[0] || dateObject.getMonth() !== +dateParts[1] - 1 || dateObject.getFullYear() !== +dateParts[2]) {
      return { valid: false, message: "La fecha proporcionada no es válida." };
    }

    return { valid: true, message: "" };
  }

  isValidQuantity(quantity: string): boolean {
    const quantityPattern = /^\d+(\,\d{1,2})?$/;
    return quantityPattern.test(quantity);
  }

  convertPrecedence(precedence: any): number {
    switch (precedence) {
      case 'PapelCartón':
        return 1;
      case 'Metal':
        return 2;
      case 'Plástico':
        return 3;
      case 'Madera':
        return 4;
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
        return -1;
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
        return -1;
    }
  }

  convertDate(dateString: any) {
    const dateParts = dateString.split('/');
    return `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
  }
}