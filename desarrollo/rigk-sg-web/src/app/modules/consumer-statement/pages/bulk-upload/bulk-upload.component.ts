import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BusinessService } from 'src/app/core/services/business.service';
import Swal from 'sweetalert2';
import { ConsumerService } from '../../../../core/services/consumer.service';
import * as XLSX from 'xlsx';
import { EstablishmentService } from '../../../../core/services/establishment.service';

@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.css']
})
export class BulkUploadComponent implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  dbBusiness: any[] = [];
  filteredBusiness: any[] = [];
  selectedBusiness: any;
  userData: any;

  constructor(public consumer: ConsumerService,
    public businessService: BusinessService,
    public establishmentService: EstablishmentService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.loadStatements();
    localStorage.removeItem('statementsState');
  }

  downloadExcel() {
    const id = this.selectedBusiness?.value;
    if (!id || id == "-1") {
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
                text: 'Empresa no tiene ningún establecimiento creado en el sistema. En caso de ser necesario, contacte al administrador del sistema.'
            });
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

  filterBusiness(event: any) {
    const query = event.query.toLowerCase();
    this.filteredBusiness = this.dbBusiness
        .filter(b => b.NAME.toLowerCase().includes(query))
        .map(b => ({ label: `${b.CODE_BUSINESS} - ${b.NAME}`, value: b.ID }));
        
      if (this.filteredBusiness.length > 0) {
          this.filteredBusiness.unshift({ label: 'Seleccionar Empresa', value: '-1' });
      } else {
          this.filteredBusiness = [{ label: 'Seleccionar Empresa', value: '-1' }];
      }
        console.log("Datos originales: ", this.dbBusiness);
        console.log("Datos filtrados: ", this.filteredBusiness);
  }

  onBusinessSelect(event: any) {
    // Asignar el nombre de la empresa seleccionada al cuadro de texto
    this.selectedBusiness = event;
    console.log("Selected Business Name: ", this.selectedBusiness);
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
    Swal.fire({
      title: 'Espere',
      text: 'Se están cargando los datos del archivo. Por favor, espere.',
      showConfirmButton: false
    });
    Swal.showLoading();
    //Validación archivo
    if (data.length == 0) {
      Swal.fire({
        icon: 'error',
        text: 'Archivo inválido. No tiene todas las columnas necesarias'
      });
      return;
    }
    const rows = data.slice(3).filter(row => row.length > 0 && row.some((item: any) => item));
    const rowsData = [];

    //Validación RUT
    let valuerut = data[0][1];
    if (!valuerut) {
      Swal.fire({
        icon: 'error',
        text: 'Error en fila 1. Campo RUT no puede venir vacío'
      });
      return;
    }

    //Validación RAZÓN SOCIAL
    let valueWithDash = data[1][1];
    if (!valueWithDash) {
      Swal.fire({
        icon: 'error',
        text: 'Error en fila 2. Campo Razón Social no puede venir vacío'
      });
      return;
    }
    let parts = valueWithDash.split(' - ');
    let code: any = await this.businessService.getBusinessByCode(parts[0]).toPromise();
    let businessId = code.data.business[0].ID;
    if (data[2].length != 9) {
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
      const excelRowNumber = i + 4;
      if (row.length == 0 && i == 0) {
        Swal.fire({
          icon: 'error',
          text: 'Archivo vacío'
        });
        return;
      }
      //Validación declaración repetida
      for (let j = i + 1; j < rows.length; j++) {
        const w = rows[j];
        if (w[0] === row[0] && w[3] === row[3] && w[4] === row[4] && w[6] === row[6] && w[1] === row[1] && w[2] === row[2]) {
          Swal.fire({
            icon: 'info',
            text: `Error en fila ${excelRowNumber}. Se repite en el archivo el mismo Establecimiento, Subcategoría, Tratamiento y Gestor para esta Fecha de Retiro. Por favor, revisar.`
          });
          return;
        }
      }
      // Código de establecimiento
      const establishmentCode = row[0];
      if (!establishmentCode || establishmentCode.trim() === '') {
        Swal.fire({
          icon: 'error',
          text: `Error en fila ${excelRowNumber}. Campo   ID VU ESTABLECIMIENTO no puede venir vacío`
        });
        return;
      }

      // Tipo de residuo
      const residueType = row[1];
      if (!residueType) {
        Swal.fire({
          icon: 'error',
          text: `Error en fila ${excelRowNumber}. Campo SUBCATEGORIA no puede venir vacío`
        });
        return;
      }
      // Tipo de tratamiento
      const treatmentType = row[2];
      if (!treatmentType) {
        Swal.fire({
          icon: 'error',
          text: `Error en fila ${excelRowNumber}. Campo TIPO TRATAMIENTO no puede venir vacío`
        });
        return;
      }
      // Subtipo
      const subType = row[3];
      if (!subType) {
        Swal.fire({
          icon: 'error',
          text: `Error en fila ${excelRowNumber}. Campo SUBTIPO no puede venir vacío`
        });
        return;
      }
      // Fecha
      const date = row[4];
      const validationResult = this.isValidDate(date);
      if (!validationResult.valid) {
        Swal.fire({
          icon: 'error',
          text: `Error en la fila ${excelRowNumber}. ${validationResult.message}`
        });
        return;
      }
      // Número de guía de despacho
      const dispatchGuideNumber = row[5];
      if (!dispatchGuideNumber) {
        Swal.fire({
          icon: 'error',
          text: `Error en fila ${excelRowNumber}. Campo NUM GUIA DESPACHO no puede venir vacío`
        });
        return;
      }
      // Tipo específico
      const gestor = row[6];
      if (!gestor) {
        Swal.fire({
          icon: 'error',
          text: `Error en fila ${excelRowNumber}. Campo GESTOR no puede venir vacío`
        });
        return;
      }

      let partsGestor = gestor.split(' - ');
      let gestorsId: any = await this.businessService.getBusinessByCode(partsGestor[2]).toPromise();
      if(partsGestor[0] == 1){
        gestorsId = 0;
      }
      // Tipo específico
      const gestorIdVu = row[7];
      if (!gestorIdVu) {
        Swal.fire({
          icon: 'error',
          text: `Error en fila ${excelRowNumber}. Campo  ID VU GESTOR no puede venir vacío`
        });
        return;
      }
      //Cantidad

      if (row[8] == undefined) {
        Swal.fire({
          icon: 'error',
          text: `Error en fila ${excelRowNumber}. Campo CANTIDAD (KG) no puede venir vacío.`
        });
        return;
      }
      
      const sanitizedQuantity = row[8].toString().replace(',', '.');
      const quantity = parseFloat(sanitizedQuantity);

      if (quantity <= 0) {
        Swal.fire({
          icon: 'error',
          text: `Cantidad debe ser numérica mayor que cero en fila ${excelRowNumber}.`
        });
        return;
      }

      if (isNaN(quantity) || !quantity) {
        Swal.fire({
          icon: 'error',
          text: `Cantidad no válida en la fila ${excelRowNumber}. Asegúrese de usar una coma como separador de decimales`
        });
        return;
      }
      const precedenceNumber = this.convertPrecedence(row[1]);
      if (precedenceNumber == -1) {
        Swal.fire({
          icon: 'error',
          text: `Subcategoría no válida en fila: ${excelRowNumber}`
        });
        return;
      }
      const typeResidueNumber = this.convertTypeResidue(row[3]);
      if (typeResidueNumber == -1) {
        Swal.fire({
          icon: 'error',
          text: `Tipo de residuo no válido en fila: ${excelRowNumber}`
        });
        return;
      }
      const verifyMaterial = await this.consumer.verifyMaterial(precedenceNumber, typeResidueNumber).toPromise();
      if (!verifyMaterial.status) {
        Swal.fire({
          icon: 'error',
          text: `Error en fila ${excelRowNumber}. Subtipo no corresponde a la subcategoría`
        });
        return;
      }
      const treatmentTypeNumber = this.convertTreatmentType(row[2]);
      if (treatmentTypeNumber == -1) {
        Swal.fire({
          icon: 'error',
          text: `Tipo de tratamiento no válido en fila: ${excelRowNumber}`
        });
        return;
      }

      const dateFormateada = this.convertDate(date);

      let valueEstablishment = row[0];
      let partsEstablishment = valueEstablishment.split(' - ');
      let establishments: any = await this.establishmentService.getIdByEstablishment(partsEstablishment[0], partsEstablishment[1], partsEstablishment[2], partsEstablishment[3]).toPromise();
      let establishmentId = establishments.status[0].ID;
      const gestorIdValue = gestorsId === 0 ? 0 : gestorsId.data.business[0].ID;
      const r: any = await this.consumer.checkRow({ treatment: treatmentTypeNumber, sub: typeResidueNumber, gestor: gestorIdValue, date: dateFormateada, idEstablishment: establishmentId }).toPromise();
      if (!r.status) {
        Swal.fire({
          icon: 'info',
          text: `La declaración de la fila ${excelRowNumber} ya ha sido declarada, Mismo tratamiento, material, subtipo y gestor para esta fecha`
        });
        return;
      }
      if(partsEstablishment[1] != partsGestor[1] && gestorIdValue != 0){
        Swal.fire({
          icon: 'error',
          text: `La región del gestor en la fila ${excelRowNumber} no coincide con la del establecimiento seleccionado.`
        });
        return;
      }
      const verifyGestor = await this.consumer.verifyGestor(partsGestor[2], precedenceNumber).toPromise();
      if (!verifyGestor.status && gestorIdValue != 0) {
        Swal.fire({
          icon: 'error',
          text: `Error en fila ${excelRowNumber}. Gestor no corresponde a la subcategoría ni al establecimiento`
        });
        return;
      }
      const rowData = {
        establishmentId,
        date,
        precedence: precedenceNumber,
        typeResidue: typeResidueNumber,
        quantity,
        LER: '',
        treatmentType: treatmentTypeNumber,
        businessId: gestorIdValue
      };
      rowsData.push(rowData);
    }
    // Obtiene el ID del usuario de la variable de sesión
    const userId = this.userData.ID;

    // Obtiene la fecha actual
    const currentDate = new Date().toISOString().replace('T', ' ').replace('Z', '');

    for (const rowData of rowsData) {
      // Obtiene el año de la fecha proporcionada en el Excel
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
            VALUE: parseFloat(rowData.quantity.toFixed(2).replace(",", ".")),
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
      });
    }
    Swal.fire({
      icon: 'success',
      text: 'Se ha subido el archivo Excel correctamente y los datos se han guardado en la base de datos'
    });
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

    if (dateObject.getDate() !== +dateParts[0] || dateObject.getMonth() !== +dateParts[1] - 1 || dateObject.getFullYear() !== +dateParts[2]) {
      return { valid: false, message: "La fecha proporcionada no es válida." };
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
      case 'Mezclados':
        return 5;
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
      case "Esquineros Conos":
        return 4;
      case "Cartón RH":
        return 5;
      case "Papel Otros":
        return 6;
      case "Envase Aluminio":
        return 7;
      case "Malla o Reja (IBC)":
        return 8;
      case "Envase Hojalata":
        return 9;
      case "Esquineros Metal":
        return 10;
      case "Metal Otros":
        return 11;
      case "Plástico Film Embalaje":
        return 12;
      case "Plástico Envases Rigidos (Incl. Tapas)":
        return 13;
      case "Plástico Saco o Maxisacos":
        return 14;
      case "Plástico EPS (Poliestireno Expandido)":
        return 15;
      case "Plástico Zuncho":
        return 16;
      case "Plástico Otros":
        return 17;
      case "Caja de Madera":
        return 18;
      case "Pallet de Madera":
        return 19;
      case "EyE sin separación":
        return 20;
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
      case "Reciclaje Interno":
        return 4;
      case "Preparación Reutilización":
        return 5;
      case "DF en Relleno Seguridad":
        return 6;
      default:
        return -1;
    }
  }

  convertDate(dateString: any) {
    const dateParts = dateString.split('/');
    return `${dateParts[2]}-${dateParts[1].padStart(2, '0')}-${dateParts[0].padStart(2, '0')}`;
  }
}