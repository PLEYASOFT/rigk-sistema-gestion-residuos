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
  invoices: any[] = [];
  invoicesDuplicated: any[] = [];
  allInvoices: any[] = [];
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
    Swal.fire({
      title: 'Procesando datos',
      text: 'Se estan validando los datos',
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    if (data.length == 0) {
      Swal.fire({
        icon: 'error',
        text: 'Archivo inválido. No tiene todas las columnas necesarias'
      });
      return;
    }

    const rows = data.slice(1).filter(row => row.length > 0 && row.some((item: any) => item));
    const rowsData = [];
    const rowsDataDuplicated = [];
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
    const allMaterials = await this.managerService.getAllMaterials().toPromise();
    const allTypeTreatment = await this.managerService.getAllTreatments().toPromise();

    const allBusiness = await this.businessService.getAllBusiness().toPromise();

    const sameRowsVerf = new Set();

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

      let materialTypeNum;
      const MT = allMaterials.status.find((item: { ID: number; MATERIAL: string; }) => item.MATERIAL === material);
      if (!MT) {
        Swal.fire({
          icon: 'error',
          text: `No se encontró ningun material con el nombre "${material}" en la fila ${excelRowNumber}`
        });
        return;
      }
      if (MT) {
        materialTypeNum = MT.ID;
        console.log(materialTypeNum);
      }

      let treatmentTypeNum;
      const TT = allTypeTreatment.status.find((item: { ID: number; NAME: string; }) => item.NAME === treatmentType);
      if (!TT) {
        Swal.fire({
          icon: 'error',
          text: `No se encontró ningun tipo de tratamiento con el nombre "${treatmentType}" en la fila ${excelRowNumber}`
        });
        return;
      }
      if (TT) {
        treatmentTypeNum = TT.ID;
        console.log(treatmentTypeNum);
      }

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
      const foundCompany = allBusiness.status.find((item: { NAME: string; VAT: string; ID: number; }) => item.NAME === vatCompanyName && item.VAT === vat);

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
      let declaratedWeightResponse;
      const businessResponse = await this.establishmentService.getInovice(numberInvoice, vat, treatmentTypeNum, materialTypeNum, idBusiness).toPromise();
      if (businessResponse.status) {
        totalWeight = (this.formatNumber(businessResponse.data[0]?.invoice_value));
        declaratedWeightResponse = (this.formatNumber(businessResponse.data[0].value_declarated));
      }
      else {
        Swal.fire({
          icon: 'error',
          text: `La fila ${excelRowNumber} tiene el siguiente error: ` + businessResponse.msg
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
      if (totalWeight !== 0 && totalWeight !== row[10]) {
        Swal.fire({
          icon: 'info',
          text: `La factura con numero ${numberInvoice} de la fila ${excelRowNumber} ya cuenta con datos existentes, favor de ingresar el peso total registrado previamente (${totalWeight})`
        });
        return;
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
      declaratedWeight = row[11];
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
      let fixedRemainingWeight;
      if (declaratedWeightResponse !== 0) {
        const numericDeclaratedWeight = parseFloat(declaratedWeightResponse.toString().replace(",", "."));
        const PrevRemainingWeight = numericTotalWeight - numericDeclaratedWeight;
        const remainingWeight = PrevRemainingWeight - numericValuedWeight;
        fixedRemainingWeight = remainingWeight.toFixed(2).replace(".", ",");
        if (remainingWeight < 0) {
          Swal.fire({
            icon: 'error',
            text: `Peso remanente calculado en la fila ${excelRowNumber} no puede ser menor que cero.\n ${PrevRemainingWeight} - ${valuedWeight}  = ${fixedRemainingWeight}`
          });
          return;
        }
      }
      if (declaratedWeightResponse == 0) {
        const remainingWeight = numericTotalWeight - numericValuedWeight;
        fixedRemainingWeight = remainingWeight.toFixed(2).replace(".", ",");
        if (remainingWeight < 0) {
          Swal.fire({
            icon: 'error',
            text: `Peso remanente calculado en la fila ${excelRowNumber} no puede ser menor que cero.\n ${totalWeight} - ${valuedWeight}  = ${fixedRemainingWeight}`
          });
          return;
        }
      }

      for (let j = i + 1; j < rows.length; j++) {
        const w = rows[j];
        // cuando las facturas tienen valores iguales
        if (w[2] !== row[2] && w[3] === row[3] && w[6] === row[6] && w[7] === row[7] && w[8] === row[8]) {
          Swal.fire({
            icon: 'info',
            text: `Distintos tipos de tratamiento con el mismo tipo de material, Núm de factura reciclador, rut reciclador y reciclador en las filas ${i+2} y ${j+2}`
          });
          return;
        }
        if (w[2] === row[2] && w[3] !== row[3] && w[6] === row[6] && w[7] === row[7] && w[8] === row[8]) {
          Swal.fire({
            icon: 'info',
            text: `Distintos tipos de material con el mismo tipo de tratamiento, Núm de factura reciclador, rut reciclador y reciclador en las filas ${i+2} y ${j+2}`
          });
          return;
        }
        if (w[2] !== row[2] && w[3] !== row[3] && w[6] === row[6] && w[7] === row[7] && w[8] === row[8]) {
          Swal.fire({
            icon: 'info',
            text: `Distintos tipos de tratamiento y material con el mismo Núm de factura reciclador, rut reciclador y reciclador en las filas ${i+2} y ${j+2}`
          });
          return;
        }
        if (w[2] === row[2] && w[3] === row[3] && w[6] === row[6] && w[7] === row[7] && w[8] === row[8] && w[10] !== row[10]) {
          Swal.fire({
            icon: 'info',
            text: `Ingresar el mismo peso total para todas las facturas iguales con numero ${row[6]}`
          });
          return;
        }
        // LOGICA DE SUMAR TODOS LOS PESOS... VER COMO MANEJAR 
        if (w[2] === row[2] && w[3] === row[3] && w[6] === row[6] && w[7] === row[7] && w[8] === row[8] && w[10] === row[10]) {
          sameRowsVerf.add(row);
          sameRowsVerf.add(w);
        }
      }

      const idDetail = row[13];

      const dateParts = admissionDate.split('/');
      const formatedDateString = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      const tempAdmissionDate = new Date(formatedDateString);
      const backAdmissionDate = tempAdmissionDate.toISOString().split('T')[0];

      const tempFrontAdmissionDate = backAdmissionDate.split('-');
      const frontAdmissionDate = `${tempFrontAdmissionDate[2]}-${tempFrontAdmissionDate[1]}-${tempFrontAdmissionDate[0]}`;

      const foundInvoice = noAprovedInvoices.find((item: { NAME_BUSINESS: string; NAME_ESTABLISHMENT_REGION: string; TipoTratamiento: string; PRECEDENCE: string; TYPE_RESIDUE: string; VALUE: number; ID_DETAIL: number; }) => item.NAME_BUSINESS === nameBusiness && item.NAME_ESTABLISHMENT_REGION === establishment && item.TipoTratamiento === treatmentType && item.PRECEDENCE === material && item.TYPE_RESIDUE === subMaterial && item.VALUE === parseFloat(row[11]) && item.ID_DETAIL == parseInt(idDetail));
      
      if (!foundInvoice) {
        Swal.fire({
          icon: 'error',
          text: `No se encontró ninguna factura pendiente en la base de datos con los registros de la fila ${excelRowNumber}`
        });
        return;
      }
      
      const totalWeightFormated = parseFloat(totalWeight.replace(",", ".")).toFixed(2).replace(".", ",").toString();
      const valuedWeightFormated = parseFloat(valuedWeight.replace(",", ".")).toFixed(2).replace(".", ",").toString();
      let declaratedWeightFormated;
      // viene de la llamada api
      if (typeof declaratedWeight === 'number') {
        declaratedWeightFormated = parseFloat(declaratedWeight.toString().replace(",", ".")).toFixed(2).replace(".", ",").toString();
      }
      // viene del excel
      if (typeof declaratedWeight === 'string') {
        declaratedWeightFormated = parseFloat(declaratedWeight.replace(",", ".")).toFixed(2).replace(".", ",").toString();
      }
      
      const rowData = {
        nameBusiness,             //Empresa CI
        idBusiness,               //ID reciclador
        establishment,            //Establecimiento
        treatmentType,            //Tipo de tratamiento
        material,                 //Tipo de material
        subMaterial,              //Subtipo de material
        withdrawalDate,           //Fecha de retiro
        numberInvoice,            //Nº de factura
        vat,                      //Rut
        vatCompanyName,           //Nombre de reciclador
        backAdmissionDate,        //Fecha ingreso PR
        totalWeight,              //Peso total
        declaratedWeight,         //Peso declarado
        valuedWeight,             //Peso valorizado
        fixedRemainingWeight,     //Peso remanente
        idDetail,                 //ID detalle
        frontAdmissionDate,       //SOLO VISUAL
        totalWeightFormated,      //SOLO VISUAL
        valuedWeightFormated,     //SOLO VISUAL
        declaratedWeightFormated, //SOLO VISUAL
        declaratedWeightResponse,
        materialTypeNum,
        treatmentTypeNum,
      };
      let included = false;
      for (const arreglo of sameRowsVerf) {
        const arregloD = arreglo as any[];
        if (arregloD.includes(numberInvoice)) {
          included = true;
        }
      }
      if (included == false) {
        rowsData.push(rowData);
      }
      if (included == true) {
        rowsDataDuplicated.push(rowData);
      }
    }

    const groupedData: { [key: string]: { tipo_tratamiento: string, material: string, numero_factura: string, rut_reciclador: string, nombre_reciclador: string, remanente_total: number } } = {};

    let valorTotal = null;
    let facturaInicial = null;

    for (const value of rowsDataDuplicated) {
      const key = `${value.numberInvoice}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          tipo_tratamiento: value.treatmentType,
          material: value.material,
          numero_factura: value.numberInvoice,
          rut_reciclador: value.vat,
          nombre_reciclador: value.vatCompanyName,
          remanente_total: 0
        };
      }
      if (valorTotal === null && facturaInicial === null) {
        if (parseFloat(value.declaratedWeightResponse) !== 0) {
          let numericTotalWeight = parseFloat(value.totalWeight.toString().replace(",", "."));
          let numericDeclaratedWeight = parseFloat(value.declaratedWeightResponse.toString().replace(",", "."));
          valorTotal = numericTotalWeight - numericDeclaratedWeight;
        }else{
          valorTotal = parseFloat(value.totalWeight.replace(",", "."));
        }
        facturaInicial = parseFloat(value.numberInvoice);
      }    
      if (facturaInicial != parseFloat(value.numberInvoice)) {
        if (parseFloat(value.declaratedWeightResponse) !== 0) {
          let numericTotalWeight = parseFloat(value.totalWeight.toString().replace(",", "."));
          let numericDeclaratedWeight = parseFloat(value.declaratedWeightResponse.toString().replace(",", "."));
          valorTotal = numericTotalWeight - numericDeclaratedWeight;
        }else{
          valorTotal = parseFloat(value.totalWeight.replace(",", "."));
        }
        facturaInicial = parseFloat(value.numberInvoice);
      }
      const valorizadoSuma = parseFloat(value.valuedWeight.replace(",", "."));
      valorTotal! -= valorizadoSuma;
      value.fixedRemainingWeight = valorTotal!.toFixed(2).replace(".", ",").toString();
      groupedData[key].remanente_total = valorTotal!;
    }

    for (const key in groupedData) {
      if (groupedData.hasOwnProperty(key)) {
        const remanenteTotal = groupedData[key].remanente_total;
        if (remanenteTotal < 0) {
          Swal.fire({
            icon: 'error',
            text: `Los remanentes totales para las facturas con numero ${key} son menores a cero: ${remanenteTotal}`,
          });
          return;
        }
      }
    }
    //groupedData contiene los datos agrupados con la suma correspondiente
    this.invoices = rowsData;
    this.invoicesDuplicated = rowsDataDuplicated;
    this.allInvoices = Array.from([...rowsData, ...rowsDataDuplicated]);
    Swal.close();
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
    let errores = false
    for (let i = 0; i < this.allInvoices.length; i++) {
      const element = this.allInvoices[i];
      if (this.allInvoices.length == Object.keys(this.fileNames).length && this.fileNames[i]) {
        try {
          const response = await this.establishmentService.saveInvoice(element.vat, element.idBusiness, element.numberInvoice, element.idDetail, element.backAdmissionDate, element.valuedWeight!.replace(",", "."), element.totalWeight!.replace(",", "."), element.treatmentTypeNum, element.materialTypeNum, this.fileToUpload[i]).toPromise();
          if (!response.status) {
            errores = true;
            this.allInvoices = [];
            Swal.close();
            Swal.fire({
              icon: 'error',
              text: `Ha habido un error y el proceso se ha detenido, consulte más tarde el estado de sus declaraciones para ver cuales fueron exitosamente aprobadas y cuales no.`
            });
            return;
          }
        } catch (error) {
            // Manejo de otros errores
            errores = true; // Se establece la variable de errores en true
            this.allInvoices = [];
            Swal.close();
            Swal.fire({
              icon: 'error',
              text: `Ha habido un error y el proceso se ha detenido, consulte más tarde el estado de sus declaraciones para ver cuales fueron exitosamente aprobadas y cuales no.`
            });
            return;
        }
      }
    }
    this.allInvoices = [];
    if (!errores) {
      Swal.close();
      Swal.fire({
        icon: 'success',
        text: `Sus facturas han sido ingresadas correctamente`
      });
    }    
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
}