import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { validate } from 'rut.js';
import { BusinessService } from 'src/app/core/services/business.service';
import { EstablishmentService } from 'src/app/core/services/establishment.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.css']
})
export class StatementsComponent implements OnInit {
  fileName: any;
  fileBuffer: any;
  selectedFile: any;
  disableWeightFields: boolean = true;

  userData: any | null;
  dbStatements: any[] = [];
  db: any[] = [];
  pos = 1;

  business_name: any[] = [];
  establishment_name: any[] = [];
  material_name: any[] = [];
  treatment_name: any[] = [];
  years: number[] = [];
  state: number[] = [];
  cant: number = 0;
  filteredStatements: any[] = [];

  selectedBusiness: string = '-1';
  selectedMaterial: string = '-1';
  selectedYear: string = '-1';
  selectedTreatment: string = '-1';
  selectedState: any = '-1';
  autoFilter: boolean = true;
  isRemainingWeightNegative: boolean = false;

  index: number = 0;
  userForm = this.fb.group({
    invoiceNumber: ['', [Validators.required]],
    rut: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}[0-9]{3}[0-9]{3}-[0-9Kk]{1}$'), this.verifyRut]],
    reciclador: ['0', [Validators.required]],
    treatmentType: ['', [Validators.required]],
    material: ['', [Validators.required]],
    entryDate: ['', [Validators.required, this.pastDateValidator()]],
    totalWeight: ['', [Validators.required, this.minStringValue(0), Validators.pattern(/^[0-9]+(,[0-9]+)?$/)]],
    declarateWeight: [''],
    valuedWeight: ['', [Validators.required, this.minStringValue(0),Validators.pattern(/^[0-9]+(,[0-9]+)?$/)]],
    remainingWeight: [''],
    asoc: [''],
    declarated: [''],
    attachment: [null, [Validators.required, this.fileTypeValidator, this.fileSizeValidator]]
  });

  dbBusiness = [];
  constructor(
    public productorService: ProductorService,
    private establishmentService: EstablishmentService,
    public businessService: BusinessService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);

    this.loadStatements().then(() => {
      this.filter();
      this.pagTo(this.pos - 1);
    });

    this.userForm.controls['valuedWeight'].disable();
    this.userForm.controls['totalWeight'].disable();
    this.userForm.controls['reciclador'].disable();
  }

  loadStatements(): Promise<void> {
    return new Promise<void>((resolve) => {
      Swal.fire({
        title: 'Cargando Datos',
        text: 'Se están recuperando datos',
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false
      });
      Swal.showLoading();
      this.establishmentService.getDeclarationEstablishment().subscribe(r => {
        if (r.status) {
          r.status = r.status.sort((a: any, b: any) => {
            const dateComparison = new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime();
            
            if (dateComparison === 0) {
              return b.ID_DETAIL - a.ID_DETAIL;
            } else {
              return dateComparison;
            }
          });

          (r.status as any[]).forEach(e => {

            if (this.business_name.indexOf(e.NAME_BUSINESS) == -1) {
              this.business_name.push(e.NAME_BUSINESS);
            }
            if (this.establishment_name.indexOf(e.NAME_ESTABLISHMENT_REGION) == -1) {
              this.establishment_name.push(e.NAME_ESTABLISHMENT_REGION);
            }
            if (this.years.indexOf(e.FechaRetiroTipeada) == -1) {
              this.years.push(e.FechaRetiroTipeada)
            }
            if (this.material_name.indexOf(e.PRECEDENCE) == -1) {
              this.material_name.push(e.PRECEDENCE)
            }
            if (this.treatment_name.indexOf(e.TipoTratamiento) == -1) {
              this.treatment_name.push(e.TipoTratamiento)
            }
            if (this.state.indexOf(e.STATE_GESTOR) == -1) {
              this.state.push(e.STATE_GESTOR)
            }
          });
          this.years.sort((a, b) => b - a);
          this.dbStatements = r.status;
          this.cant = Math.ceil(this.dbStatements.length / 10);
          this.db = this.dbStatements.slice((this.pos - 1) * 10, this.pos * 10).sort((a: any, b: any) => {
            const dateComparison = new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime();
            
            if (dateComparison === 0) {
              return b.ID_DETAIL - a.ID_DETAIL;
            } else {
              return dateComparison;
            }
          });
          Swal.close();
        }
        resolve();
      })
    });
  }

  filter(auto: boolean = false) {
    if (auto && !this.autoFilter) return;

    this.filteredStatements = this.dbStatements.filter(r => {
      return (
        (this.selectedBusiness === '-1' || r.NAME_BUSINESS === this.selectedBusiness) &&
        (this.selectedMaterial === '-1' || r.PRECEDENCE === this.selectedMaterial) &&
        (this.selectedTreatment === '-1' || r.TipoTratamiento === this.selectedTreatment) &&
        (this.selectedYear === '-1' || r.FechaRetiroTipeada === this.selectedYear) &&
        (this.selectedState === '-1' || parseInt(r.STATE_GESTOR) === parseInt(this.selectedState))
      );
    });
    this.db = this.filteredStatements.slice(0, 10).sort((a: any, b: any) => {
      const dateComparison = new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime();
      
      if (dateComparison === 0) {
        return b.ID_DETAIL - a.ID_DETAIL;
      } else {
        return dateComparison;
      }
    });
    this.cant = Math.ceil(this.filteredStatements.length / 10);
  }


  updateFilters() {
    // Filtrar las opciones de business_name
    this.business_name = this.dbStatements
      .filter(
        (r) =>
          (this.selectedTreatment === "-1" ||
            r.TipoTratamiento === this.selectedTreatment) &&
          (this.selectedMaterial === "-1" || r.PRECEDENCE === this.selectedMaterial) &&
          (this.selectedYear === "-1" || r.FechaRetiroTipeada === this.selectedYear) &&
          (this.selectedState === "-1" || parseInt(r.STATE_GESTOR) === parseInt(this.selectedState) || r.STATE_GESTOR === undefined)
      )
      .map((r) => r.NAME_BUSINESS)
      .filter((value, index, self) => self.indexOf(value) === index);
    // Filtrar las opciones de treatment_name
    this.treatment_name = this.dbStatements
      .filter(
        (r) =>
          (this.selectedBusiness === "-1" || r.NAME_BUSINESS === this.selectedBusiness) &&
          (this.selectedMaterial === "-1" || r.PRECEDENCE === this.selectedMaterial) &&
          (this.selectedYear === "-1" || r.FechaRetiroTipeada === this.selectedYear) &&
          (this.selectedState === "-1" || parseInt(r.STATE_GESTOR) === parseInt(this.selectedState) || r.STATE_GESTOR === undefined)
      )
      .map((r) => r.TipoTratamiento)
      .filter((value, index, self) => self.indexOf(value) === index);
    // Filtrar las opciones de material_name
    this.material_name = this.dbStatements
      .filter(
        (r) =>
          (this.selectedBusiness === "-1" || r.NAME_BUSINESS === this.selectedBusiness) &&
          (this.selectedTreatment === "-1" || r.TipoTratamiento === this.selectedTreatment) &&
          (this.selectedYear === "-1" || r.FechaRetiroTipeada === this.selectedYear) &&
          (this.selectedState === "-1" || parseInt(r.STATE_GESTOR) === parseInt(this.selectedState) || r.STATE_GESTOR === undefined)
      )
      .map((r) => r.PRECEDENCE)
      .filter((value, index, self) => self.indexOf(value) === index);
    // Filtrar las opciones de years
    this.years = this.dbStatements
      .filter(
        (r) =>
          (this.selectedBusiness === "-1" || r.NAME_BUSINESS === this.selectedBusiness) &&
          (this.selectedTreatment === "-1" || r.TipoTratamiento === this.selectedTreatment) &&
          (this.selectedMaterial === "-1" || r.PRECEDENCE === this.selectedMaterial) &&
          (this.selectedState === "-1" || parseInt(r.STATE_GESTOR) === parseInt(this.selectedState) || r.STATE_GESTOR === undefined)
      )
      .map((r) => r.FechaRetiroTipeada)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => b - a);
    // Filtrar las opciones de state
    this.state = this.dbStatements
      .filter(
        (r) =>
          (this.selectedBusiness === "-1" || r.NAME_BUSINESS === this.selectedBusiness) &&
          (this.selectedTreatment === "-1" || r.TipoTratamiento === this.selectedTreatment) &&
          (this.selectedMaterial === "-1" || r.PRECEDENCE === this.selectedMaterial) &&
          (this.selectedYear === "-1" || r.FechaRetiroTipeada === this.selectedYear)
      )
      .map((r) => parseInt(r.STATE_GESTOR))
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  reset() {
    this.loadStatements().then(() => {
      this.filter();
      this.pagTo(this.pos - 1);
    });
    this.userForm.reset({reciclador:'0'})
  }
  pagTo(i: number) {
    this.pos = i + 1;
    this.db = this.filteredStatements.slice((i * 10), (i + 1) * 10).sort((a: any, b: any) => {
            const dateComparison = new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime();
            
            if (dateComparison === 0) {
              return b.ID_DETAIL - a.ID_DETAIL;
            } else {
              return dateComparison;
            }
          });
  }

  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.filteredStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a: any, b: any) => {
            const dateComparison = new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime();
            
            if (dateComparison === 0) {
              return b.ID_DETAIL - a.ID_DETAIL;
            } else {
              return dateComparison;
            }
          });
  }

  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.filteredStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a: any, b: any) => {
            const dateComparison = new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime();
            
            if (dateComparison === 0) {
              return b.ID_DETAIL - a.ID_DETAIL;
            } else {
              return dateComparison;
            }
          });
  }

  setArrayFromNumber() {
    return new Array(this.cant);
  }

  getStateText(state: number): string {
    return state === 0 ? 'Por aprobar' : 'Aprobado';
  }

  handleClick(index: number, stateGestor: number): void {
    this.dbBusiness = [];
    if (stateGestor === 0) {
      this.onMaterialTreatmentChange(index);
      this.index = index;
    }
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
        this.userForm.controls['attachment'].setErrors({ 'invalidFileType': true });
        this.userForm.controls['attachment'].markAsTouched();
      } else if (file.size > 1 * 1024 * 1024) {
        this.userForm.controls['attachment'].setErrors({ 'invalidFileSize': true });
        this.userForm.controls['attachment'].markAsTouched();
      } else {
        this.userForm.controls['attachment'].setErrors(null);
        this.userForm.controls['attachment'].markAsTouched();
      }
    } else {
      this.selectedFile = null;
    }
  }

  async saveInvoice(index: number): Promise<void> {
    if (this.selectedFile) {
      const { rut, invoiceNumber, entryDate, valuedWeight, reciclador } = this.userForm.value;
      const totalWeight = this.userForm.controls['totalWeight'].value;
      const treatmentType = this.db[index].TREATMENT_TYPE_NUMBER
      const material = this.db[index].PRECEDENCE_NUMBER
      const id_detail = this.db[index].ID_DETAIL
      try {
        const response = await this.establishmentService.saveInvoice(rut, reciclador, invoiceNumber, id_detail, entryDate, valuedWeight!.replace(",", "."), totalWeight!.replace(",", "."), treatmentType, material, this.selectedFile).toPromise();
        if (response.status) {
          setTimeout(async () => {
            await Swal.fire({
              title: "La factura fue guardada exitosamente",
              text: "",
              icon: "success",
              showConfirmButton: true, // Muestra el botón de confirmación.
            });
          }, 1500);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('No file selected');
    }
  }
  businessNoFound = false;
  onChangeVAT(target: any) {
    this.dbBusiness = [];
    this.businessService.getBusinessByVAT(target.value).subscribe(r => {
      this.dbBusiness = r.status || [];
      this.userForm.controls['reciclador'].enable();
      this.businessNoFound = false;
      if (this.dbBusiness.length == 0) {
        this.businessNoFound = true;
        this.userForm.controls['reciclador'].disable();
        this.userForm.controls['reciclador'].setValue('0');
      }
    });
  }
  formatNumber(value: any) {
    if (value === null || value === undefined) {
      return '';
    } else if (Number.isInteger(value)) {
      return value;
    } else {
      return value.toLocaleString('es');
    }
  }  
  async onRUTChange(index: number) {
    const rut = this.userForm.controls['rut'].value;
    const invoiceNumber = this.userForm.controls['invoiceNumber'].value;
    const treatmentType = this.db[index].TREATMENT_TYPE_NUMBER;
    const material = this.db[index].PRECEDENCE_NUMBER;
    const id_business = this.userForm.value.reciclador;
    if (rut) {
      try {
        const businessResponse = await this.establishmentService.getInovice(invoiceNumber, rut, treatmentType, material, id_business).toPromise();
        if (businessResponse.status) {
          
          this.userForm.controls['totalWeight'].setValue(
            this.formatNumber(businessResponse.data[0]?.invoice_value)
          );
          this.userForm.controls['declarateWeight'].setValue(
            this.formatNumber(businessResponse.data[0].value_declarated)
          );
          this.userForm.controls['asoc'].setValue(businessResponse.data[0].num_asoc + 1);
          const asoc = this.userForm.controls['asoc'].value || "0";
          if (parseInt(asoc) > 1) {
            if (invoiceNumber) {
              this.userForm.controls['valuedWeight'].enable();
            } else {
              this.userForm.controls['valuedWeight'].disable();
            }
          } else {
            if (invoiceNumber) {
              this.userForm.controls['valuedWeight'].enable();
              this.userForm.controls['totalWeight'].enable();
            } else {
              this.userForm.controls['valuedWeight'].disable();
              this.userForm.controls['totalWeight'].disable();
            }
          }

        } else {
          Swal.fire({
            icon: 'error',
            text: businessResponse.msg
          });
          this.userForm.controls['totalWeight'].setValue('');
          this.userForm.controls['declarateWeight'].setValue('');
          this.userForm.controls['asoc'].setValue('');
          this.userForm.controls['remainingWeight'].setValue('');
          this.userForm.controls['valuedWeight'].disable();
          this.userForm.controls['totalWeight'].disable();
        }
      } catch (error) {

        this.userForm.controls['totalWeight'].setValue('');
        this.userForm.controls['declarateWeight'].setValue('');
        this.userForm.controls['asoc'].setValue('');
        this.userForm.controls['remainingWeight'].setValue('');
        this.userForm.controls['valuedWeight'].disable();
        this.userForm.controls['totalWeight'].disable();
      }
    } else {
      // this.userForm.controls['reciclador'].setValue('0');
      this.userForm.controls['totalWeight'].setValue('');
      this.userForm.controls['declarateWeight'].setValue('');
      this.userForm.controls['asoc'].setValue('');
      this.userForm.controls['remainingWeight'].setValue('');
      this.userForm.controls['valuedWeight'].disable();
      this.userForm.controls['totalWeight'].disable();
    }

    this.userForm.controls['valuedWeight'].updateValueAndValidity();
    this.userForm.controls['totalWeight'].updateValueAndValidity();
  }

  async onMaterialTreatmentChange(index: any) {
    this.userForm.controls['treatmentType'].setValue(this.db[index].TipoTratamiento);
    this.userForm.controls['material'].setValue(this.db[index].PRECEDENCE);
    this.userForm.controls['declarated'].setValue(this.db[index].VALUE?.toString().replace(".", ","));
  }

  verifyRut(control: AbstractControl): { [key: string]: boolean } | null {
    const rut = control.value;
    if (validate(rut)) {
      return null;  // el RUT es válido, no hay errores
    } else {
      return { rut: true };  // el RUT es inválido, retorna un error
    }
  }

  isTotalWeightEditable(): boolean {
    const numDeclarations = 0; // Cambiar esto para obtener el valor real de Num. Declaraciones asociadas
    const invoiceNumber = this.userForm.controls['invoiceNumber'].value;
    const rut = this.userForm.controls['rut'].value;

    return numDeclarations === 0 && !!invoiceNumber && !!rut;
  }

  getNumericValue(control?: AbstractControl<string | null, string | null> | null): number {
    return control && control.value ? +control.value.toString().replace(",", ".") : 0;
  }

  calculateRemainingWeight(): any {
    const totalWeightControl = this.userForm.get('totalWeight');
    const valuedWeightControl = this.userForm.get('valuedWeight');
    const valueDeclarateControl = this.userForm.get('declarateWeight');

    const totalWeight = this.getNumericValue(totalWeightControl);
    const valuedWeight = this.getNumericValue(valuedWeightControl);
    const declarateWeight = this.getNumericValue(valueDeclarateControl);

    const remainingWeight = totalWeight - valuedWeight - declarateWeight;

    this.isRemainingWeightNegative = remainingWeight < 0;

    return remainingWeight.toFixed(2).replace(".", ",");
  }
  replaceDot(s: string) {
    if ((s.toString().split(".")).length == 2) {
      return s && parseFloat(s).toFixed(2).replace('.', ',');
    } else {
      return s && s.toString().replace('.', ',');
    }
  }

  minStringValue(min: number): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (!control.value) {
        return null;
      }
      const numberValue = parseFloat(control.value.replace(',', '.'));
      return isNaN(numberValue) || numberValue <= min ? { 'minStringValue': { value: control.value } } : null;
    };
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

  pastDateValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const selectedDate = new Date(control.value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return selectedDate > now ? { 'futureDate': { value: control.value } } : null;
    };
  }
}
