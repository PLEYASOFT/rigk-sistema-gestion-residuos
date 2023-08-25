import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
import Swal from 'sweetalert2';
import { ManagerService } from '../../../../core/services/manager.service';
//import { ConsumerService } from '../../../../core/services/consumer.service';
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
    this.loadStatements();
    localStorage.removeItem('statementsState');
  }

  downloadExcel() {
    // const id = (document.getElementById('f_name') as HTMLInputElement).value
    // if (id == "-1") {
    //   Swal.fire({
    //     icon: 'error',
    //     text: 'Debe seleccionar empresa'
    //   });
    //   return;
    // }
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
  onFileChange2(event: any) {
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
  
      const reader: FileReader = new FileReader();
      // reader.onload = (e: any) => {
      //   const bstr: string = e.target.result;
      //   const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      //   if (!wb.SheetNames.includes('Carga Masiva')) {
      //     Swal.fire({
      //       icon: 'error',
      //       text: 'No se encontró la hoja "Carga Masiva" en el archivo'
      //     });
      //     return;
      //   }
      //   const ws: XLSX.WorkSheet = wb.Sheets['Carga Masiva'];
      //   const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      //   this.processData(data);
      // };
      //reader.readAsBinaryString(file);
  
       this.resetFileInput();
    }
  
    resetFileInput2() {
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
  
      // Recorrer cada fila del excel
      const invoices: any = await this.establishmentService.getDeclarationEstablishment().toPromise();
      const noAprovedInvoices = [...invoices.status].filter(i=> i.STATE_GESTOR==0);
  
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
  
        // RUT RECICLADOR [7] -> validar
        const vat = row[7];
        if (!vat) {
          Swal.fire({
            icon: 'error',
            text: `RUT no ingresado en la fila ${excelRowNumber}`
          });
          return;
        }
        const verifyVat: any = await this.businessService.getBusinessByVAT(vat).toPromise();
        if (!verifyVat.status) {
          Swal.fire({
            icon: 'error',
            text: `RUT ingresado en la fila ${excelRowNumber} no se encuentra registrado en el sistema.`
          });
          return;
        }
        console.log();
        
        const idBusiness = verifyVat.status
        // const regex = /^\d{7,8}-[\dK]$/;
        // if (!regex.test(vat.toUpperCase())) {
        //   Swal.fire({
        //     icon: 'error',
        //     text: `RUT no válido en la fila ${excelRowNumber}, el formato correcto es sin puntos y con guion.`
        //   });
        //   return;
        // }
  
        // RECICLADOR [8] -> validar
        const vatCompanyName = row[8];
        if (!vatCompanyName) {
          Swal.fire({
            icon: 'error',
            text: `Reciclador no ingresado en la fila ${excelRowNumber}`
          });
          return;
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
        const totalWeight = row[10];
        if (!totalWeight) {
          Swal.fire({
            icon: 'error',
            text: `Peso total no ingresado en la fila ${excelRowNumber}`
          });
          return;
        }
        const sanitizedtotalWeight = totalWeight.replace(',', '.');
        const totalWeightS = parseFloat(sanitizedtotalWeight);
        if (isNaN(totalWeightS)) {
          Swal.fire({
            icon: 'error',
            text: `El PESO TOTAL ingresado en la fila ${excelRowNumber} no es válido, debe ser solo números y con comas.`
          });
          return;
        }
        if (totalWeightS <= 0) {
          Swal.fire({
            icon: 'error',
            text: `El PESO TOTAL ingresado en la fila ${excelRowNumber} debe ser mayor que cero.`
          });
          return;
        }
  
        // PESO DECLARADO [11]
        const declaratedWeight = row[11];
        if (!declaratedWeight) {
          Swal.fire({
            icon: 'error',
            text: `Peso declarado no ingresado en la fila ${excelRowNumber}`
          });
          return;
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
            text: `El PESO VALORIZADO ingresado en la fila ${excelRowNumber} no es válido, debe ser solo números y con comas.`
          });
          return;
        }
        if (valuedWeightS <= 0) {
          Swal.fire({
            icon: 'error',
            text: `El PESO VALORIZADO ingresado en la fila ${excelRowNumber} debe ser mayor que cero.`
          });
          return;
        }
        // const businessResponse = await this.establishmentService.getInovice(numberInvoice, vat, treatmentType, material, id_business).toPromise();
        // if (businessResponse <= 0) {
        //   Swal.fire({
        //     icon: 'error',
        //     text: businessResponse.msg
        //   });
        //   return;
        // }
  
        const rowData = {
          nameBusiness,
          establishment,
          treatmentType,
          material,
          subMaterial,
          withdrawalDate,
          numberInvoice,
          vat,
          vatCompanyName,
          admissionDate,
          totalWeight,
          declaratedWeight,
          valuedWeight
        };
        rowsData.push(rowData);
      }
      this.example = rowsData;
    }

  isValidDate(dateString: string): { valid: boolean; message: string } {
    if (typeof dateString === 'undefined' || dateString.trim() === '') {
      return { valid: false, message: "La fecha no puede estar vacía." };
    }

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
    return `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
  }
}