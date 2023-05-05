import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  userForm: any;
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

    this.userForm = this.fb.group({
      invoiceNumber: ['', [Validators.required]],
      rut: ['', [Validators.required, Validators.pattern('^[0-9]{1,2}[0-9]{3}[0-9]{3}-[0-9Kk]{1}$'), this.verifyRut]],
      reciclador: ['', [Validators.required]],
      treatmentType: ['', [Validators.required]],
      material: ['', [Validators.required]],
      entryDate: ['', [Validators.required]],
      totalWeight: ['', [Validators.required, Validators.pattern(/^-?[0-9]+(\.[0-9]+)?$/)]],
      declarateWeight: [''],
      valuedWeight: ['', [Validators.required, Validators.pattern(/^-?[0-9]+(\.[0-9]+)?$/)]],
      remainingWeight: [''],
      asoc: [''],
      attachment: [null, [Validators.required, this.fileTypeValidator, this.fileSizeValidator]]
    });
    this.userForm.controls['valuedWeight'].disable();
    this.userForm.controls['totalWeight'].disable();
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
          r.status = r.status.sort(((a: any, b: any) => new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime()));

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
          this.db = this.dbStatements.slice((this.pos - 1) * 10, this.pos * 10).sort((a, b) => new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime()).reverse();
          Swal.close();
          console.log(this.db)
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
    this.db = this.filteredStatements.slice(0, 10).sort((a, b) => new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime()).reverse();;
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
    this.userForm.reset()
  }
  console() {
    console.log(this.userForm.controls)
  }
  pagTo(i: number) {
    this.pos = i + 1;
    this.db = this.filteredStatements.slice((i * 10), (i + 1) * 10).sort((a, b) => new Date(a.FechaRetiro).getTime() - new Date(b.FechaRetiro).getTime()).reverse();
  }

  next() {
    if (this.pos >= this.cant) return;
    this.pos++;
    this.db = this.filteredStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => new Date(a.FechaRetiro).getTime() - new Date(b.FechaRetiro).getTime()).reverse();
  }

  previus() {
    if (this.pos - 1 <= 0 || this.pos >= this.cant + 1) return;
    this.pos = this.pos - 1;
    this.db = this.filteredStatements.slice((this.pos - 1) * 10, (this.pos) * 10).sort((a, b) => new Date(a.FechaRetiro).getTime() - new Date(b.FechaRetiro).getTime()).reverse();
  }

  setArrayFromNumber() {
    return new Array(this.cant);
  }

  getStateText(state: number): string {
    return state === 0 ? 'Por aprobar' : 'Aprobado';
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

  async onRUTChange(index: number) {
    const rut = this.userForm.controls['rut'].value;
    const invoiceNumber = this.userForm.controls['invoiceNumber'].value;
    const treatmentType = this.db[index].TREATMENT_TYPE_NUMBER
    const material = this.db[index].PRECEDENCE_NUMBER
    if (rut) {
      try {
        const businessResponse = await this.establishmentService.getInovice(invoiceNumber, rut, treatmentType, material).toPromise();
        console.log(businessResponse)
        if (businessResponse.status) {
          console.log('entra: ', rut, invoiceNumber, treatmentType, material)
          this.userForm.controls['reciclador'].setValue(businessResponse.data[0].NAME);
          this.userForm.controls['totalWeight'].setValue(businessResponse.data[0].invoice_value);
          this.userForm.controls['declarateWeight'].setValue(businessResponse.data[0].value_declarated);
          this.userForm.controls['asoc'].setValue(businessResponse.data[0].num_asoc);
          if (invoiceNumber) {
            this.userForm.controls['valuedWeight'].enable();
            this.userForm.controls['totalWeight'].enable();
          } else {
            this.userForm.controls['valuedWeight'].disable();
            this.userForm.controls['totalWeight'].disable();
          }
        } else {
          this.userForm.controls['reciclador'].setValue('');
          this.userForm.controls['totalWeight'].setValue('');
          this.userForm.controls['declarateWeight'].setValue('');
          this.userForm.controls['asoc'].setValue('');
          this.userForm.controls['valuedWeight'].disable();
          this.userForm.controls['totalWeight'].disable();
        }
      } catch (error) {
        console.error('Error al obtener el nombre del reciclador:', error);
        this.userForm.controls['reciclador'].setValue('');
        this.userForm.controls['totalWeight'].setValue('');
        this.userForm.controls['declarateWeight'].setValue('');
        this.userForm.controls['asoc'].setValue('');
        this.userForm.controls['valuedWeight'].disable();
        this.userForm.controls['totalWeight'].disable();
      }
    } else {
      this.userForm.controls['reciclador'].setValue('');
      this.userForm.controls['totalWeight'].setValue('');
      this.userForm.controls['declarateWeight'].setValue('');
      this.userForm.controls['asoc'].setValue('');
      this.userForm.controls['valuedWeight'].disable();
      this.userForm.controls['totalWeight'].disable();
    }

    this.userForm.controls['valuedWeight'].updateValueAndValidity();
    this.userForm.controls['totalWeight'].updateValueAndValidity();
  }

  async onMaterialTreatmentChange(index: any) {
    this.userForm.controls['treatmentType'].setValue(this.db[index].TipoTratamiento);
    this.userForm.controls['material'].setValue(this.db[index].PRECEDENCE);
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
    return control && control.value ? +control.value : 0;
  }

  calculateRemainingWeight(): number {
    const totalWeightControl = this.userForm.get('totalWeight');
    const valuedWeightControl = this.userForm.get('valuedWeight');

    const totalWeight = this.getNumericValue(totalWeightControl);
    const valuedWeight = this.getNumericValue(valuedWeightControl);

    const remainingWeight = totalWeight - valuedWeight;

    this.isRemainingWeightNegative = remainingWeight < 0;

    return remainingWeight;
  }
}
