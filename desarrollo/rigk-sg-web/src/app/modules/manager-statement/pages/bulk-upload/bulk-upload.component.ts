import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
import Swal from 'sweetalert2';
import { ManagerService } from '../../../../core/services/manager.service';
import * as XLSX from 'xlsx';
import { EstablishmentService } from 'src/app/core/services/establishment.service';
@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  dbBusiness: any[] = [];
  userData: any;
  example: any[] = [];
  index: number = 0;
  fileNames: any = {};
  verification: number = 0
  fileToUpload: any = {};

  wasteTypes: any = {
    'PapelCartón': ['Papel', 'Papel Compuesto (cemento)', 'Caja Cartón', 'Papel/Cartón Otro'],
    'Metal': ['Envase Aluminio', 'Malla o Reja (IBC)', 'Envase Hojalata', 'Metal Otro'],
    'Plástico': ['Plástico Film Embalaje', 'Plástico Envases Rígidos (Incl. Tapas)', 'Plástico Sacos o Maxisacos', 'Plástico EPS (Poliestireno Expandido)', 'Plástico Zuncho', 'Plástico Otro'],
    'Madera': ['Caja de Madera', 'Pallet de Madera']
  };
  constructor(public establishmentService: EstablishmentService,
    public managerService: ManagerService,
    public businessService: BusinessService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    // this.loadStatements();
    localStorage.removeItem('statementsState');
  }

  downloadExcel() {
    Swal.fire({
      title: 'Generando Excel',
      text: 'Esto puede tardar varios minutos',
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.managerService.downloadExcelTemplateInvoice().subscribe({
      next: r => {
        if (r) {
          const file = new Blob([r], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(file);
          link.download = `carga masiva gestor`;
          document.body.appendChild(link);
          link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
          link.remove();
          window.URL.revokeObjectURL(link.href);
          Swal.close();
        }
      },
      error: error => {
        if (error instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const responseText = reader.result as string; // Convertir a string
            try {
              const responseObject = JSON.parse(responseText);
              if (responseObject.status === false && responseObject.message) {
                Swal.fire({
                  icon: 'error',
                  text: responseObject.message
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  text: 'Documento para carga masiva no disponible.'
                });
              }
            } catch (jsonError) {
              Swal.fire({
                icon: 'error',
                text: 'Error desconocido al procesar la respuesta.'
              });
            }
          };
          reader.readAsText(error);
        } else {
          Swal.fire({
            icon: 'error',
            text: 'Error desconocido al procesar la respuesta.'
          });
        }
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

    const size = target.files[0].size
    const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB

    if (size > maxSizeInBytes) {
      Swal.fire({
        icon: 'error',
        text: 'Tamaño del archivo excede el límite (1MB máximo).'
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
          text: 'No se encontró la hoja "Carga Masiva" en el archivo.'
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
  
  onInvoiceChange(event: any, index: number) {
    const allowedMimeTypes = [
      "application/pdf",
      "image/jpeg",
    ];

    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length > 1) {
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
        text: 'Tipo de archivo incorrecto. Por favor, cargue un archivo válido (.pdf, .jpeg o .jpg)'
      });
      return;
    }

    const size = target.files[0].size
    const maxSizeInBytes = 1 * 1024 * 1024; // 1 MB

    if (size > maxSizeInBytes) {
      Swal.fire({
        icon: 'error',
        text: 'Tamaño del archivo excede el límite (1MB máximo).'
      });
      return;
    }

    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.fileNames[index] = selectedFile.name;
      this.fileToUpload[index] = selectedFile;
      this.verification = Object.keys(this.fileNames).length;
    }

    this.resetFileInput();
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
    if (rows.length == 0) {
      Swal.fire({
        icon: 'info',
        text: 'Archivo inválido, verifique que no esté vacío.'
      });
      return;
    }

    if (data[0].length != 13) {
      Swal.fire({
        icon: 'error',
        text: 'Archivo inválido, no tiene todas las columnas necesarias.'
      });
      return;
    }

    const invoices: any = await this.establishmentService.getDeclarationEstablishment().toPromise();
    const noAprovedInvoices = invoices.status.filter((item: { STATE_GESTOR: number; }) => item.STATE_GESTOR === 0);
    
    const allBusiness = await this.businessService.getAllBusiness().toPromise();

    // Recorrer cada fila del excel
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

      // EMPRESA CI [0]
      const nameBusiness = row[0];
      if (!nameBusiness) {
        Swal.fire({
          icon: 'error',
          text: `Empresa CI no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }
      
      // ESTABLECIMIENTO [1]
      const establishment = row[1];
      if (!establishment) {
        Swal.fire({
          icon: 'error',
          text: `Establecimiento no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }

      // TIPO TRATAMIENTO [2]
      const treatmentType = row[2];
      if (!treatmentType) {
        Swal.fire({
          icon: 'error',
          text: `Tipo de tratamiento no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }

      // MATERIAL [3]
      const material = row[3];
      if (!material) {
        Swal.fire({
          icon: 'error',
          text: `Material no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }

      // SUBTIPO [4]
      const subMaterial = row[4];
      if (!subMaterial) {
        Swal.fire({
          icon: 'error',
          text: `Subtipo no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }

      // FECHA RETIRO [5]
      const withdrawalDate = row[5];
      if (!withdrawalDate) {
        Swal.fire({
          icon: 'error',
          text: `Fecha retiro no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }
      
      // NÚM. FACTURA RECICLADOR [6] -> validar
      const numberInvoice = row[6];
      if (!numberInvoice) {
        Swal.fire({
          icon: 'error',
          text: `Numero factura no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }
      if (numberInvoice <= 0) {
        Swal.fire({
          icon: 'error',
          text: `Numero factura ingresado en la fila ${excelRowNumber} debe ser mayor que cero`
        });
        return;
      }

      // RUT RECICLADOR [7] -> validar
      const vat = row[7];
      if (!vat) {
        Swal.fire({
          icon: 'error',
          text: `RUT no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }
      
      const materialTypeNum = this.convertPrecedence(material);
      const treatmentTypeNum = this.convertTreatmentType(treatmentType);

      // RECICLADOR [8] -> validar
      const vatCompanyName = row[8];
      if (!vatCompanyName) {
        Swal.fire({
          icon: 'error',
          text: `Reciclador no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }

      let idBusiness;
      const foundCompany = allBusiness.status.find((item: { NAME: string; VAT: string; ID: number;}) => item.NAME === vatCompanyName && item.VAT === vat);
      
      if (!foundCompany) {
        Swal.fire({
          icon: 'error',
          text: `No se encontró ningun reciclador con el nombre "${vatCompanyName}" asociado al rut "${vat}" en la fila ${excelRowNumber}`
        });
        return;
      }
      if (foundCompany) {
        idBusiness = foundCompany.ID;
      }

      // FECHA INGRESO PR [9] -> validar
      const admissionDate = row[9];
      if (!admissionDate) {
        Swal.fire({
          icon: 'error',
          text: `Fecha ingreso PR no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }

      const validationResult = this.isValidDate(admissionDate);
      if (!validationResult.valid) {
        Swal.fire({
          icon: 'error',
          text: `Error en la fila ${excelRowNumber}. ${validationResult.message}`
        });
        return;
      }

      // PESO TOTAL [10] -> validar
      let totalWeight;
      // PESO DECLARADO [11] -> validar
      let declaratedWeight: string | number;
      const businessResponse = await this.establishmentService.getInovice(numberInvoice, vat, treatmentTypeNum, materialTypeNum, idBusiness).toPromise();
      if (businessResponse.status) {
        totalWeight = (this.formatNumber(businessResponse.data[0]?.invoice_value));
        declaratedWeight = (this.formatNumber(businessResponse.data[0].value_declarated));
      }
      else {
        Swal.fire({
          icon: 'error',
          text: `La fila ${excelRowNumber} tiene el siguiente error: `+businessResponse.msg
        });
        return;
      }
      if (totalWeight == 0 && !row[10]) {
        Swal.fire({
          icon: 'error',
          text: `Peso total no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }
      if (totalWeight == 0) {
        totalWeight = row[10];
      }
      const sanitizedtotalWeight = totalWeight.replace(',', '.');
      const totalWeightS = parseFloat(sanitizedtotalWeight);
      if (isNaN(totalWeightS)) {
        Swal.fire({
          icon: 'error',
          text: `Peso total ingresado en la fila ${excelRowNumber} no es válido, debe ser solo números y con comas.`
        });
        return;
      }
      if (totalWeightS <= 0) {
        Swal.fire({
          icon: 'error',
          text: `Peso total ingresado en la fila ${excelRowNumber} debe ser mayor que cero.`
        });
        return;
      }
      // PESO DECLARADO [11]
      if (declaratedWeight == 0 && !row[11]) {
        Swal.fire({
          icon: 'error',
          text: `Peso declarado no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }
      if (declaratedWeight == 0) {
        declaratedWeight = row[11];
      }
      // PESO VALORIZADO [12] -> validar
      const valuedWeight = row[12];
      if (!valuedWeight) {
        Swal.fire({
          icon: 'error',
          text: `Peso valorizado no ingresado en la fila ${excelRowNumber}`
        });
        return;
      }
      const sanitizedValuedWeight = valuedWeight.replace(',', '.');
      const valuedWeightS = parseFloat(sanitizedValuedWeight);
      if (isNaN(valuedWeightS)) {
        Swal.fire({
          icon: 'error',
          text: `Peso valorizado ingresado en la fila ${excelRowNumber} no es válido, debe ser solo números y con comas.`
        });
        return;
      }
      if (valuedWeightS <= 0) {
        Swal.fire({
          icon: 'error',
          text: `Peso valorizado ingresado en la fila ${excelRowNumber} debe ser mayor que cero.`
        });
        return;
      }
      const numericTotalWeight = parseFloat(totalWeight.toString().replace(",", "."));
      const numericValuedWeight = parseFloat(valuedWeight.toString().replace(",", "."));
      const numericDeclaratedWeight = typeof declaratedWeight === 'string' ? parseFloat(declaratedWeight.toString().replace(",", ".")) : declaratedWeight;
      
      const remainingWeight = numericTotalWeight - numericValuedWeight;
      const fixedRemainingWeight = remainingWeight.toFixed(2).replace(".", ",");
      if (remainingWeight < 0) {
        Swal.fire({
          icon: 'error',
          text: `Peso remanente calculado en la fila ${excelRowNumber} no puede ser menor que cero.\n ${totalWeight} - ${valuedWeight}  = ${fixedRemainingWeight}`
        });
        return;
      }

      for (let j = i + 1; j < rows.length; j++) {
        const w = rows[j];

        if (w[2] !== row[2] && w[3] === row[3] && w[6] === row[6] && w[7] === row[7] && w[8] === row[8]) {
          Swal.fire({
            icon: 'info',
            text: `Distintos Tipos de tratamiento y/o material en las filas ${j} y ${excelRowNumber}`
          });
          return;
        }
        if (w[2] === row[2] && w[3] !== row[3] && w[6] === row[6] && w[7] === row[7] && w[8] === row[8]) {
          Swal.fire({
            icon: 'info',
            text: `Distintos Tipos de tratamiento y/o material en las filas ${j} y ${excelRowNumber}`
          });
          return;
        }
        if (w[2] !== row[2] && w[3] !== row[3] && w[6] === row[6] && w[7] === row[7] && w[8] === row[8]) {
          Swal.fire({
            icon: 'info',
            text: `Distintos tipos de tratamiento y material con el mismo Núm de factura reciclador, rut reciclador y reciclador en las filas ${j} y ${excelRowNumber}`
          });
          return;
        }
        // LOGICA DE SUMAR TODOS LOS PESOS... VER COMO MANEJAR 
        if (w[2] === row[2] && w[3] === row[3] && w[6] === row[6] && w[7] === row[7] && w[8] === row[8]) {
          Swal.fire({
            icon: 'info',
            text: `Favor de aprobar individualmente facturas iguales de las filas ${j} y ${excelRowNumber}`
          });
          return;
        }
      }

      const idDetail = row[13];

      const dateParts = admissionDate.split('/');
      const formatedDateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      const tempAdmissionDate = new Date(formatedDateString);
      const backAdmissionDate = tempAdmissionDate.toISOString().split('T')[0];

      const tempFrontAdmissionDate = backAdmissionDate.split('-');
      const frontAdmissionDate = `${tempFrontAdmissionDate[2]}-${tempFrontAdmissionDate[1]}-${tempFrontAdmissionDate[0]}`;

      const foundInvoice = noAprovedInvoices.find((item: { NAME_BUSINESS: string; NAME_ESTABLISHMENT_REGION: string; TipoTratamiento: string; PRECEDENCE:string; TYPE_RESIDUE:string; VALUE: number; ID_DETAIL: number;}) => item.NAME_BUSINESS === nameBusiness && item.NAME_ESTABLISHMENT_REGION === establishment && item.TipoTratamiento === treatmentType && item.PRECEDENCE === material && item.TYPE_RESIDUE === subMaterial && item.VALUE === (typeof declaratedWeight === 'string' ? parseFloat(declaratedWeight) : declaratedWeight) && item.ID_DETAIL == parseInt(idDetail));
      
      if (!foundInvoice) {
        Swal.fire({
          icon: 'error',
          text: `No se encontró ninguna factura pendiente en la base de datos con los registros de la fila ${excelRowNumber}`
        });
        return;
      }

      const rowData = {
        nameBusiness,           //Empresa CI
        idBusiness,             //ID reciclador
        establishment,          //Establecimiento
        treatmentType,          //Tipo de tratamiento
        material,               //Tipo de material
        subMaterial,            //Subtipo de material
        withdrawalDate,         //Fecha de retiro
        numberInvoice,          //Nº de factura
        vat,                    //Rut
        vatCompanyName,         //Nombre de reciclador
        backAdmissionDate,      //Fecha ingreso PR
        totalWeight,            //Peso total
        declaratedWeight,       //Peso declarado
        valuedWeight,           //Peso valorizado
        fixedRemainingWeight,   //Peso remanente
        idDetail,               //ID detalle
        frontAdmissionDate
      };
      rowsData.push(rowData);
    }
    this.example = rowsData;
  }

  async saveAllInvoices(): Promise<void> {
    Swal.fire({
      title: 'Ingresando datos',
      text: 'Se estan cargando los datos',
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    Swal.showLoading();

    for (let i = 0; i < this.example.length; i++) {
      const element = this.example[i];
      if (this.example.length == Object.keys(this.fileNames).length && this.fileNames[i]) {
        try {
          const response = await this.establishmentService.saveInvoice(element.vat, element.idBusiness, element.numberInvoice, element.idDetail, element.backAdmissionDate, element.valuedWeight!.replace(",", "."), element.totalWeight!.replace(",", "."), this.convertTreatmentType(element.treatmentType), this.convertPrecedence(element.material), this.fileToUpload[i]).toPromise();
          if (response.status) {
          }
        } catch (error) {
          Swal.close();
          Swal.fire({
            icon: 'error',
            text: `Ha habido un error y el proceso se ha detenido, consulte más tarde el estado de sus declaraciones para ver cuales fueron exitosamente aprobadas y cuales no`
          });
          return;
        }
      } else {
        Swal.fire({
          icon: 'error',
          text: `No ha ingresado todas las facturas`
        });
        return;
      }
    }
    this.example = [];
    Swal.close();
    Swal.fire({
      icon: 'success',
      text: `Sus facturas han sido ingresadas correctamente`
    });
  }

  formatNumber(value: any) {
    if (value === null || value === undefined) {
      return '';
    } else if (Number.isInteger(value)) {
      return value.toString();
    } else {
      return value.toLocaleString('es');
    }
  }

  isValidDate(dateString: string): { valid: boolean; message: string } {
    if (typeof dateString === 'undefined' || dateString.trim() === '') {
      return { valid: false, message: "Fecha no puede estar vacía." };
    }

    const dateParts = dateString.split("/");

    if (dateParts.length !== 3 || isNaN(+dateParts[0]) || isNaN(+dateParts[1]) || isNaN(+dateParts[2])) {
      return { valid: false, message: "Formato de la fecha es incorrecto. Formato requerido: DD/MM/AAAA" };
    }

    const dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
    const now = new Date();

    // Elimina la hora de la fecha actual, para que sólo se compare la fecha.
    now.setHours(0, 0, 0, 0);

    if (dateObject > now) {
      return { valid: false, message: "Fecha no debe ser futura." };
    }

    if (dateObject.getDate() !== +dateParts[0] || dateObject.getMonth() !== +dateParts[1] - 1 || dateObject.getFullYear() !== +dateParts[2]) {
      return { valid: false, message: "Fecha proporcionada no es válida." };
    }

    return { valid: true, message: "" };
  }

  convertPrecedence(precedence: any): number {
    switch (precedence) {
      case 'Papel/Cartón':
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
}