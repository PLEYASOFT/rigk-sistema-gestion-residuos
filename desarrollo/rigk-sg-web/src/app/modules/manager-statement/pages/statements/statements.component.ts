import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { validate } from 'rut.js';
import { BusinessService } from 'src/app/core/services/business.service';
import { EstablishmentService } from 'src/app/core/services/establishment.service';
import { ProductorService } from 'src/app/core/services/productor.service';
import { ChangeDetectorRef } from '@angular/core';
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
  selectAllChecked: boolean = false;
  autoFilter: boolean = true;
  isRemainingWeightNegative: boolean = false;
  anyCheckboxSelected: boolean = false;

  gestor_name: any[] = [];
  selectedGestor: string = '-1';

  index: number = 0;
  userForm = this.fb.group({
    empresaGestor: ['', Validators.required],
    invoiceNumber: ['', [Validators.required]],
    rut: ['', [Validators.required, /*Validators.pattern('^[0-9]{1,2}[0-9]{3}[0-9]{3}-[0-9Kk]{1}$'), this.verifyRut*/]],
    reciclador: ['', [this.validRecycler]],
    treatmentType: ['', [Validators.required]],
    material: ['', [Validators.required]],
    entryDate: ['', [Validators.required, this.pastDateValidator()]],
    totalWeight: ['', [Validators.required, this.minStringValue(0), Validators.pattern(/^[0-9]+(,[0-9]+)?$/)]],
    declarateWeight: [''],
    valuedWeight: ['', [Validators.required, this.minStringValue(0), Validators.pattern(/^[0-9]+(,[0-9]+)?$/)]],
    remainingWeight: [''],
    asoc: [''],
    declarated: [''],
    attachment: [null, [Validators.required, this.fileTypeValidator, this.fileSizeValidator]]
  });

  dbBusiness = [];
  selectedDeclarationsCount: any = 0;
  selectedWeight: any = 0;
  isAnyCheckboxSelected: boolean = false;
  disableFilters: any;
  constructor(
    public productorService: ProductorService,
    private establishmentService: EstablishmentService,
    public businessService: BusinessService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
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
      const idGestors = JSON.parse(sessionStorage.getItem('user')!).ID_BUSINESS;
      Swal.fire({
        title: 'Cargando Datos',
        text: 'Se están recuperando datos',
        timerProgressBar: true,
        showConfirmButton: false,
        allowEscapeKey: false,
        allowOutsideClick: false
      });
      Swal.showLoading();
      this.establishmentService.getDeclarationEstablishmentByIdGestor(idGestors).subscribe(r => {
        if (r.status) {
          r.data = r.data.filter((item: any) => item.TipoTratamiento != null);
          r.data = r.data.sort((a: any, b: any) => {
            const dateComparison = new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime();

            if (dateComparison === 0) {
              return b.ID_DETAIL - a.ID_DETAIL;
            } else {
              return dateComparison;
            }
          });

          (r.data as any[]).forEach(e => {
            e.isChecked = false;
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
            if (this.treatment_name.indexOf(e.TipoTratamiento) === -1) {
              this.treatment_name.push(e.TipoTratamiento);
            }
            if (this.state.indexOf(e.STATE_GESTOR) == -1) {
              this.state.push(e.STATE_GESTOR)
            }
            if (this.gestor_name.indexOf(e.NAME_GESTOR) == -1) {
              this.gestor_name.push(e.NAME_GESTOR)
            }
          });
          this.years.sort((a, b) => b - a);
          this.dbStatements = r.data;
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

  openApprovalModal() {
    const selectedItems = this.db.filter(s => s.isChecked && s.STATE_GESTOR == 0);

    // Comprobar si hay elementos seleccionados
    if (selectedItems.length > 0) {
      // Actualizar el formulario con los valores correspondientes
      this.userForm.patchValue({
        declarated: this.selectedWeight,
        treatmentType: selectedItems[0].TipoTratamiento,
        material: selectedItems[0].PRECEDENCE,
        empresaGestor: selectedItems[0].NAME_GESTOR
      });

      // Simular un clic en el botón que abre el modal
      document.getElementById('openModalButton')?.click();
    } else {
      console.log('error')
    }
  }

  filter(auto: boolean = false) {
    if (auto && !this.autoFilter) return;

    const selectedStateNum = parseInt(this.selectedState);

    this.filteredStatements = this.dbStatements.filter(r => {
      const rStateGestorNum = parseInt(r.STATE_GESTOR);
      return (
        (this.selectedBusiness === '-1' || r.NAME_BUSINESS === this.selectedBusiness) &&
        (this.selectedMaterial === '-1' || r.PRECEDENCE === this.selectedMaterial) &&
        (this.selectedTreatment === '-1' || r.TipoTratamiento === this.selectedTreatment) &&
        (this.selectedYear === '-1' || r.FechaRetiroTipeada === this.selectedYear) &&
        (this.selectedState === '-1' || rStateGestorNum === selectedStateNum) &&
        (this.selectedGestor === '-1' || r.NAME_GESTOR === this.selectedGestor)
      );
    });

    this.db = this.filteredStatements.slice(0, 10).sort((a, b) =>
      new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime() || b.ID_DETAIL - a.ID_DETAIL
    );

    this.cant = Math.ceil(this.filteredStatements.length / 10);
    this.selectedDeclarationsCount = 0;
    this.selectedWeight = 0;
    this.selectAllChecked = false;

    this.filteredStatements.forEach(s => {
      s.isChecked = s.STATE_GESTOR == 0 ? false : s.isChecked;
    });

    this.anyCheckboxSelected = this.filteredStatements.some(s => s.isChecked && parseInt(s.STATE_GESTOR) == 0);
    this.cdr.detectChanges();
  }


  filter_two(auto: boolean = false) {
    if (auto && !this.autoFilter) return;

    const selectedStateNum = parseInt(this.selectedState);

    this.filteredStatements = this.dbStatements.filter(r => {
      const rStateGestorNum = parseInt(r.STATE_GESTOR);
      return (
        (this.selectedBusiness === '-1' || r.NAME_BUSINESS === this.selectedBusiness) &&
        (this.selectedMaterial === '-1' || r.PRECEDENCE === this.selectedMaterial) &&
        (this.selectedTreatment === '-1' || r.TipoTratamiento === this.selectedTreatment) &&
        (this.selectedYear === '-1' || r.FechaRetiroTipeada === this.selectedYear) &&
        (this.selectedState === '-1' || rStateGestorNum === selectedStateNum) &&
        (this.selectedGestor === '-1' || r.NAME_GESTOR === this.selectedGestor)
      );
    });

    this.db = this.filteredStatements.slice(0, 10).sort((a, b) =>
      new Date(b.FechaRetiro).getTime() - new Date(a.FechaRetiro).getTime() || b.ID_DETAIL - a.ID_DETAIL
    );

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
          (this.selectedState === "-1" || parseInt(r.STATE_GESTOR) === parseInt(this.selectedState) || r.STATE_GESTOR === undefined) &&
          (this.selectedGestor === "-1" || r.NAME_GESTOR === this.selectedGestor)
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
          (this.selectedState === "-1" || parseInt(r.STATE_GESTOR) === parseInt(this.selectedState) || r.STATE_GESTOR === undefined) &&
          (this.selectedGestor === "-1" || r.NAME_GESTOR === this.selectedGestor)
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
          (this.selectedState === "-1" || parseInt(r.STATE_GESTOR) === parseInt(this.selectedState) || r.STATE_GESTOR === undefined) &&
          (this.selectedGestor === "-1" || r.NAME_GESTOR === this.selectedGestor)
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
          (this.selectedState === "-1" || parseInt(r.STATE_GESTOR) === parseInt(this.selectedState) || r.STATE_GESTOR === undefined) &&
          (this.selectedGestor === "-1" || r.NAME_GESTOR === this.selectedGestor)
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
          (this.selectedYear === "-1" || r.FechaRetiroTipeada === this.selectedYear) &&
          (this.selectedGestor === "-1" || r.NAME_GESTOR === this.selectedGestor)
      )
      .map((r) => parseInt(r.STATE_GESTOR))
      .filter((value, index, self) => self.indexOf(value) === index);
    // Filtrar las opciones de gestor_name
    this.gestor_name = this.dbStatements
      .filter(
        (r) =>
          (this.selectedBusiness === "-1" || r.NAME_BUSINESS === this.selectedBusiness) &&
          (this.selectedTreatment === "-1" || r.TipoTratamiento === this.selectedTreatment) &&
          (this.selectedMaterial === "-1" || r.PRECEDENCE === this.selectedMaterial) &&
          (this.selectedYear === "-1" || r.FechaRetiroTipeada === this.selectedYear) &&
          (this.selectedState === "-1" || parseInt(r.STATE_GESTOR) === parseInt(this.selectedState) || r.STATE_GESTOR === undefined)
      )
      .map((r) => r.NAME_GESTOR)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  reset() {
    this.loadStatements().then(() => {
      this.filter();
      this.pagTo(this.pos - 1);
    });
    this.userForm.reset({ reciclador: '' })
  }

  reset_nocheck() {
    this.userForm.reset({ reciclador: '' })
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

  visiblePageNumbers() {
    const totalPages = this.setArrayFromNumber().length;
    const visiblePages = [];

    if (totalPages <= 15) {
      // Si hay 20 o menos páginas, mostrar todas
      for (let i = 0; i < totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Calcular las páginas visibles alrededor de la página actual
      let startPage = Math.max(0, this.pos - Math.floor(15 / 2));
      let endPage = Math.min(totalPages - 1, startPage + 14);

      // Ajustar el cálculo si estamos cerca del final
      if (endPage - startPage + 1 < 15) {
        endPage = totalPages - 1;
        startPage = Math.max(0, endPage - 14);
      }

      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }
    }

    return visiblePages;
  }

  getStateText(state: number): string {
    return state === 0 ? 'Por Aprobar' : 'Aprobado';
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
    if (!this.selectedFile) {
      console.error('No hay archivo seleccionado');
      return;
    }

    let { rut, invoiceNumber, entryDate, valuedWeight, reciclador } = this.userForm.value;
    const totalWeight = parseFloat(this.userForm.controls['totalWeight'].value!.replace(",", "."));
    const valuedWeightFloat = parseFloat(valuedWeight!.replace(",", "."));

    const selectedItems = this.filteredStatements.filter(s => s.isChecked && s.STATE_GESTOR == 0);
    const itemsToProcess = selectedItems.length > 0 ? selectedItems : [this.db[index]];

    Swal.fire({
      title: 'Cargando Datos',
      text: 'Se están recuperando datos',
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });

    try {
      const totalDeclaredWeight = itemsToProcess.reduce((sum, current) => sum + parseFloat(current.VALUE), 0);

      for (const item of itemsToProcess) {
        console
        const { TREATMENT_TYPE_NUMBER: treatmentType, PRECEDENCE_NUMBER: material, ID_DETAIL: id_detail, VALUE, IdGestor: IdGestor } = item;
        const declaredWeight = parseFloat(VALUE);
        const proportionalValuedWeight = ((declaredWeight / totalDeclaredWeight) * valuedWeightFloat).toFixed(2);
        const response = await this.establishmentService.saveInvoice(
          rut, reciclador, invoiceNumber, id_detail, entryDate, proportionalValuedWeight, totalWeight, treatmentType, material, this.selectedFile, IdGestor
        ).toPromise();
        if (response.status) {
          this.updateItemState(id_detail, proportionalValuedWeight);
        }
      }

      Swal.close();
      await this.showSuccessMessage(itemsToProcess.length > 1);
    } catch (error) {
      Swal.close();
      console.error('Error:', error);
    }
  }
 
  updateItemState(id_detail: number, valuedWeight: string): void {
    const updatedItem = this.db.find(item => item.ID_DETAIL === id_detail);
    if (updatedItem) {
      updatedItem.STATE_GESTOR = 1;
      const valuedWeightNum = parseFloat(valuedWeight);
      if (valuedWeightNum % 1 === 0) {
        updatedItem.VALUE_DECLARATE = valuedWeightNum.toString().replace('.', ',');
      } else {
        updatedItem.VALUE_DECLARATE = valuedWeightNum.toFixed(2).replace('.', ',');
      }
    }
    this.cdr.detectChanges();
  }


  async showSuccessMessage(multiple: boolean) {
    await Swal.fire({
      title: multiple ? "Las facturas fueron guardadas exitosamente" : "La factura fue guardada exitosamente",
      icon: "success",
      showConfirmButton: true,
    });
  }

  businessNoFound = true;
  onChangeVAT(target: any) {
    this.dbBusiness = [];
    this.businessService.getBusinessByVAT(target.value).subscribe(r => {
      this.dbBusiness = r.status || [];
      this.userForm.controls['reciclador'].enable();
      this.businessNoFound = false;
      if (this.dbBusiness.length == 0) {
        this.businessNoFound = true;
        this.userForm.controls['reciclador'].setValue('');
      } else {
        this.businessNoFound = false;
        this.userForm.controls['reciclador'].setValue('');
      }
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

  numberOnly(event: KeyboardEvent): void {
    const controlKeys = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if (controlKeys.includes(event.key)) {
      return;
    }
    const regex = new RegExp('^[0-9]+$');
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  }

  async onRUTChange(index: number) {
    const invoiceNumber = this.userForm.controls['invoiceNumber'].value;
    const treatmentType = this.db[index].TREATMENT_TYPE_NUMBER;
    const material = this.db[index].PRECEDENCE_NUMBER;
    const IdGestor = this.db[index].IdGestor;
    try {
      const businessResponse = await this.establishmentService.getInovice(invoiceNumber, treatmentType, material, IdGestor).toPromise();
      if (businessResponse.status) {
        this.businessNoFound = true;
        this.userForm.controls['totalWeight'].setValue(this.formatNumber(businessResponse.data[0]?.invoice_value));
        this.userForm.controls['declarateWeight'].setValue(this.formatNumber(businessResponse.data[0].value_declarated));

        if (this.selectedDeclarationsCount != 0) {
          this.userForm.controls['asoc'].setValue(businessResponse.data[0].num_asoc + this.selectedDeclarationsCount);
        }
        else {
          this.userForm.controls['asoc'].setValue(businessResponse.data[0].num_asoc + 1);
        }
        const asoc = this.userForm.controls['asoc'].value || "0";
        //En aprobación masiva aquí nunca entra
        if (parseInt(asoc) > 1 && this.selectedDeclarationsCount == 0) {
          if (invoiceNumber) {
            this.userForm.controls['reciclador'].setValue(businessResponse.data[0]?.NAME
            );
            this.userForm.controls['rut'].setValue(businessResponse.data[0]?.RUT
            );
            this.userForm.controls['valuedWeight'].enable();
            this.userForm.controls['reciclador'].enable();
            this.userForm.controls['rut'].enable()
          } else {
            this.userForm.controls['reciclador'].enable();
            this.userForm.controls['rut'].enable();
            this.userForm.controls['reciclador'].setValue('');
            this.userForm.controls['rut'].setValue('');
            this.userForm.controls['valuedWeight'].disable();
          }
        } else {
          if (invoiceNumber) {
            this.userForm.controls['valuedWeight'].enable();
            this.userForm.controls['totalWeight'].enable();
            this.userForm.controls['reciclador'].setValue(businessResponse.data[0]?.NAME
            );
            this.userForm.controls['rut'].setValue(businessResponse.data[0]?.RUT
            );
            this.userForm.controls['reciclador'].enable();
            this.userForm.controls['rut'].enable();
          } else {
            this.userForm.controls['valuedWeight'].disable();
            this.userForm.controls['totalWeight'].disable();
            this.userForm.controls['reciclador'].enable();
            this.userForm.controls['rut'].enable();
            this.userForm.controls['reciclador'].setValue('');
            this.userForm.controls['rut'].setValue('');
          }
        }
      } else {
        Swal.fire({
          icon: 'error',
          text: businessResponse.msg
        });
        this.userForm.controls['totalWeight'].setValue('');
        this.userForm.controls['declarateWeight'].setValue('');
        this.userForm.controls['reciclador'].setValue('');
        this.userForm.controls['rut'].setValue('');
        this.userForm.controls['asoc'].setValue('');
        this.userForm.controls['remainingWeight'].setValue('');
        this.userForm.controls['valuedWeight'].disable();
        this.userForm.controls['totalWeight'].disable();
        this.userForm.controls['reciclador'].disable();
        this.userForm.controls['rut'].disable();
      }
    } catch (error) {
      this.userForm.controls['totalWeight'].setValue('');
      this.userForm.controls['declarateWeight'].setValue('');
      this.userForm.controls['reciclador'].setValue('');
      this.userForm.controls['rut'].setValue('');
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
    this.userForm.controls['empresaGestor'].setValue(this.db[index].NAME_GESTOR);
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
    const numDeclarations = 0;
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
    return (control: AbstractControl): { [key: string]: any } | null => {
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
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return selectedDate > now ? { 'futureDate': { value: control.value } } : null;
    };
  }

  updateCheckboxSelection() {

    const selectedGestor = this.db.find(item => item.isChecked)?.NAME_GESTOR;
    this.filteredStatements = this.dbStatements.filter(r =>
      r.STATE_GESTOR === 0 && r.NAME_GESTOR === selectedGestor
    );
    const selectedItems = this.filteredStatements.filter(s => s.isChecked && s.STATE_GESTOR == 0);
    this.anyCheckboxSelected = selectedItems.length > 0;
    // Actualizar el número de declaraciones seleccionadas
    this.selectedDeclarationsCount = selectedItems.length;

    // Calcular y actualizar el peso total declarado seleccionado
    let totalWeight = selectedItems.reduce((sum, current) => sum + parseFloat(current.VALUE), 0);

    // Formatear el peso total para usar coma como separador decimal y quitar decimales si es entero
    if (totalWeight % 1 === 0) {
      // Es un número entero
      this.selectedWeight = totalWeight.toLocaleString('es-ES');
    } else {
      // Tiene decimales
      this.selectedWeight = totalWeight.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (selectedItems.length > 0) {

      this.selectedGestor = selectedGestor;
      this.selectedState = '0'; // Estado "Por aprobar"
      this.disableFilters = true; // Deshabilitar filtros
      this.updateFilters();
    } else {
      // Si no hay elementos seleccionados, restablecer los filtros y habilitarlos
      this.selectedTreatment = '-1';
      this.selectedMaterial = '-1';
      this.selectedState = '-1';
      this.selectedGestor = '-1';
      this.disableFilters = false;
      this.filter_two();
      this.updateFilters();
      this.pagTo(0);
    }

    this.isAnyCheckboxSelected = selectedItems.length > 0;

    if (selectedItems.length == 1) {
      this.filter_two();
      this.updateFilters();
      this.pagTo(0);
    }
  }



  selectAllCheckboxes(isSelected: boolean) {
    this.filteredStatements.forEach(s => {
      if (s.STATE_GESTOR == 0) { // Solo cambiar si STATE_GESTOR es 0
        s.isChecked = isSelected;
      }
    });

    // Actualizar la vista actual (db) para reflejar los cambios
    this.db = this.filteredStatements.slice((this.pos - 1) * 10, this.pos * 10);
    this.updateCheckboxSelection();
  }

  onSelectAllCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filteredStatements.forEach(s => {
      if (s.STATE_GESTOR == 0) { // Solo cambiar si STATE_GESTOR es 0
        s.isChecked = input.checked;
      }
    });

    // Actualizar la vista actual (db) para reflejar los cambios
    this.db = this.filteredStatements.slice((this.pos - 1) * 10, this.pos * 10);
    const selectedItems = this.filteredStatements.filter(s => s.isChecked && s.STATE_GESTOR == 0);
    this.anyCheckboxSelected = this.filteredStatements.some(s => s.isChecked && s.STATE_GESTOR == 0);
    this.cdr.detectChanges();
    // Actualizar el número de declaraciones seleccionadas
    this.selectedDeclarationsCount = selectedItems.length;
    if (this.selectedDeclarationsCount == 0) {
      this.disableFilters = false
    }
    else {
      this.disableFilters = true
    }

    // Calcular y actualizar el peso total declarado seleccionado
    let totalWeight = selectedItems.reduce((sum, current) => sum + parseFloat(current.VALUE), 0);

    // Formatear el peso total para usar coma como separador decimal y quitar decimales si es entero
    if (totalWeight % 1 === 0) {
      // Es un número entero
      this.selectedWeight = totalWeight.toLocaleString('es-ES');
    } else {
      // Tiene decimales
      this.selectedWeight = totalWeight.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }

  validRecycler(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value === '') {
      return { 'invalidRecycler': true };
    }
    return null;
  }

}
