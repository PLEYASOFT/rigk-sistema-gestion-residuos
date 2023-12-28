import { Component, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductorService } from 'src/app/core/services/productor.service';
import Swal from 'sweetalert2';
import { RatesTsService } from '../../../../core/services/rates.ts.service';

@Component({
  selector: 'app-form-statement',
  templateUrl: './form-statement.component.html',
  styleUrls: ['./form-statement.component.css']
})
export class FormStatementComponent implements OnInit, AfterViewChecked, OnDestroy {

  tablas = ['EyE Reciclables', 'EyE No Reciclables', 'EyE Retornables / Reutilizables'];
  residuos = [
    'Papel/Cartón',
    'Metal',
    'Plástico',
    'Madera',
    'Envases compuestos'
  ];
  maxFiles = 9;
  isSubmited = false;
  isEdited = false;

  id_business: any = "";
  year_statement: number = 0;
  id_statement: number | null = null;

  detail = this.fb.group({
    precedence: [],
    hazard: [],
    recyclability: [1],
    type_residue: [1],
    value: [],
    amount: []
  });
  userForm: any;

  detailForm: any[] = [];

  headLastForm: any = {};
  detailLastForm: any[] = [];

  rates: any[] = [];
  listMV: any = [
    { name: "Papel/Cartón", value: 1 },
    { name: "Metal", value: 2 },
    { name: "Plástico", value: 3 }
  ];
  fileCountByMaterial: any = {
    1: 0, // "Papel/Cartón"
    2: 0, // "Metal"
    3: 0  // "Plástico"
  };
  MV_consulta: any = [];
  fileName: any;
  fileBuffer: any;
  selectedFile: any;
  constructor(private fb: FormBuilder,
    public productorService: ProductorService,
    private router: Router,
    private actived: ActivatedRoute,
    public ratesService: RatesTsService) {
    this.actived.queryParams.subscribe(r => {
      this.id_business = r['id_business'];
      this.year_statement = r['year'];
    });
  }
  ngOnDestroy(): void {
    // sessionStorage.removeItem('isEdited');
    this.suscription?.unsubscribe();
  }

  ngOnInit(): void {
    Swal.fire({
      title: 'Cargando Datos',
      text: 'Se está recuperando datos',
      timerProgressBar: true,
      showConfirmButton: false
    });
    Swal.showLoading();
    this.ratesService.getCLP.subscribe({
      next: r => {
        this.rates = r.data;
        this.getDraftStatement();
        this.getValueStatementByYear();
      },
      error: error => {
        Swal.close();
        Swal.fire({
          title: '¡Ups!',
          icon: 'error',
          text: 'No se logró obtener el valor de la UF',
          showConfirmButton: true
        });
        console.log(error);
      }
    });
    this.userForm = this.fb.group({
      MV: ["", Validators.required],
      ARCHIVO: [null, [Validators.required, this.fileTypeValidator, this.fileSizeValidator]],
    });
  }

  ngAfterViewChecked(): void {
    this.calculateDiff();
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
        this.userForm.controls['ARCHIVO'].setErrors({ 'invalidFileType': true });
        this.userForm.controls['ARCHIVO'].markAsTouched();
      } else if (file.size > 1 * 1024 * 1024) {
        this.userForm.controls['ARCHIVO'].setErrors({ 'invalidFileSize': true });
        this.userForm.controls['ARCHIVO'].markAsTouched();
      } else {
        this.userForm.controls['ARCHIVO'].setErrors(null);
        this.userForm.controls['ARCHIVO'].markAsTouched();
      }
    } else {
      this.selectedFile = null;
    }
  }

  reset() {
    this.userForm.reset();
    this.userForm.patchValue({
      MV: "",
      ARCHIVO: ""
    });
  }

  calculateDiff() {
    let amount_1 = 0.0;
    let amount_2 = 0.0;
    let amount_3 = 0.0;
    let weight_1 = 0.0;
    let weight_2 = 0.0;
    let weight_3 = 0.0;
    for (let i = 1; i <= 5; i++) {
      const actual_recyclability_1 = parseFloat((document.getElementById(`actual_weight_1_${i}`) as HTMLInputElement).value.replace(",", '.'));
      const actual_recyclability_2 = parseFloat((document.getElementById(`actual_weight_2_${i}`) as HTMLInputElement).value.replace(",", '.'));
      const actual_recyclability_3 = parseFloat((document.getElementById(`actual_weight_3_${i}`) as HTMLInputElement).value.replace(",", '.'));

      const last_recyclability_1 = parseFloat((document.getElementById(`last_weight_1_${i}`) as HTMLElement).innerHTML.replace(",", '.'));
      const last_recyclability_2 = parseFloat((document.getElementById(`last_weight_2_${i}`) as HTMLElement).innerHTML.replace(",", '.'));
      const last_recyclability_3 = parseFloat((document.getElementById(`last_weight_3_${i}`) as HTMLElement).innerHTML.replace(",", '.'));

      let diff_1 = ((actual_recyclability_1 - last_recyclability_1) / last_recyclability_1) * 100;
      let diff_2 = ((actual_recyclability_2 - last_recyclability_2) / last_recyclability_2) * 100;
      let diff_3 = ((actual_recyclability_3 - last_recyclability_3) / last_recyclability_3) * 100;

      if (last_recyclability_1 == 0) {
        diff_1 = 0;
      }
      if (last_recyclability_2 == 0) {
        diff_2 = 0;
      }
      if (last_recyclability_3 == 0) {
        diff_3 = 0;
      }

      weight_1 += parseFloat((document.getElementById(`actual_weight_1_${i}`) as HTMLInputElement).value.replace(",", ".")) || 0;
      weight_2 += parseFloat((document.getElementById(`actual_weight_2_${i}`) as HTMLInputElement).value.replace(",", ".")) || 0;
      weight_3 += parseFloat((document.getElementById(`actual_weight_3_${i}`) as HTMLInputElement).value.replace(",", ".")) || 0;

      (document.getElementById(`actual_dif_1_${i}`) as HTMLInputElement).value = `${last_recyclability_1 == 0 ? 0 : (diff_1.toFixed(0)) || 0}%`;
      (document.getElementById(`actual_dif_2_${i}`) as HTMLInputElement).value = `${last_recyclability_2 == 0 ? 0 : (diff_2.toFixed(0)) || 0}%`;
      (document.getElementById(`actual_dif_3_${i}`) as HTMLInputElement).value = `${last_recyclability_3 == 0 ? 0 : (diff_3.toFixed(0)) || 0}%`;

    }
    (document.getElementById(`total_amount_1`) as HTMLSpanElement).innerHTML = amount_1.toFixed(2).replace(".", ",");
    (document.getElementById(`total_amount_2`) as HTMLSpanElement).innerHTML = amount_2.toFixed(2).replace(".", ",");
    (document.getElementById(`total_amount_3`) as HTMLSpanElement).innerHTML = amount_3.toFixed(2).replace(".", ",");

    (document.getElementById(`total_weight_1`) as HTMLSpanElement).innerHTML = weight_1.toFixed(2).replace(".", ",");
    (document.getElementById(`total_weight_2`) as HTMLSpanElement).innerHTML = weight_2.toFixed(2).replace(".", ",");
    (document.getElementById(`total_weight_3`) as HTMLSpanElement).innerHTML = weight_3.toFixed(2).replace(".", ",");
  }
  suscription: Subscription | null = null;
  getDraftStatement() {
    this.detailForm = [];
    this.suscription = this.productorService.getValueStatementByYear(this.id_business, this.year_statement, 1).subscribe({
      next: resp => {
        if (resp.status) {
          if (resp.data.header.STATE) {
            this.router.navigate(['/productor/home']);
          }
          this.id_statement = resp.data.header.ID;
          sessionStorage.setItem('isEdited', 'true');
          sessionStorage.setItem('id_statement', this.id_statement?.toString() || 'null');
          for (let i = 0; i < resp.data.detail.length; i++) {
            const r = resp.data.detail[i];
            (document.getElementById(`inp_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}_${r?.PRECEDENCE}_${r?.HAZARD}`) as HTMLInputElement).value = '0';
          }

          for (let i = 0; i < resp.data.detail.length; i++) {
            const r = resp.data.detail[i];
            const obj = this.toLowerKeys(r);
            if (r?.VALUE == 0) continue;

            (document.getElementById(`inp_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}_${r?.PRECEDENCE}_${r?.HAZARD}`) as HTMLInputElement).value = r?.VALUE.toString().replace(".", ",");
            const tmp_weight = (parseFloat((document.getElementById(`actual_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value.replace(",", ".")) || 0) + parseFloat(r?.VALUE);
            let amount = 0;
            if (r.RECYCLABILITY == 1 && r.TYPE_RESIDUE <= 3) {
              amount = r?.VALUE * this.rates[r.TYPE_RESIDUE - 1].price;
            } else if (r.RECYCLABILITY == 2 && (r.TYPE_RESIDUE <= 3 || r.TYPE_RESIDUE == 5)) {
              amount = r?.VALUE * this.rates[3].price
            } else {
              amount = 0;
            }
            obj['amount'] = amount;
            this.detailForm.push(obj);

            (document.getElementById(`actual_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLInputElement).value = tmp_weight.toFixed(2).replace(".", ",");
          }
          sessionStorage.setItem('detailForm', JSON.stringify(this.detailForm));
        }
        this.loadMV();
      },
      error: r => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          text: r.msg,
          title: '¡Ups!'
        });
      }
    });
  }

  toLowerKeys(obj: any) {
    const entries = Object.entries(obj);
    return Object.fromEntries(
      entries.map(([key, value]) => {
        return [key.toLowerCase(), value];
      }),
    );
  }

  updateValue(recyclability: any, type_residue: any, precedence: any, hazard: any, target: any) {
    sessionStorage.setItem('isEdited', "true");
    let tmp;
    let sum = 0;
    let amount: number | string = 0;

    const pattern = /^[0-9]+(,[0-9]+)?$/;
    if (!pattern.test(target.value)) {
      target.value = 0;
    }

    let value = parseFloat(target.value.replace(",", "."));
    if (!target.value || isNaN(value) || value < 0) {
      value = 0;
      target.value = 0;
    }

    for (let i = 0; i < this.detailForm.length; i++) {
      const r = this.detailForm[i];
      if (r.type_residue == type_residue && r.recyclability == recyclability) {
        sum += parseFloat(r.value || 0);
      }
      if (r.type_residue == type_residue && r.precedence == precedence && r.hazard == hazard && r.recyclability == recyclability) {
        tmp = r;
      }
    }
    if (this.detailForm.length == 0) {
      sum = 0;
    }

    if (tmp) {
      const index = this.detailForm.indexOf(tmp);
      sum = sum - { ...this.detailForm[index] }.value;
      this.detailForm[index].value = value;
      sum += parseFloat(this.detailForm[index].value);

      if (recyclability == 1 && type_residue <= 3) {
        amount = value * this.rates[type_residue - 1].price;
      } else if (recyclability == 2 && (type_residue <= 3 || type_residue == 5)) {
        amount = value * this.rates[3].price
      } else {
        amount = 0;
      }
      this.detailForm[index].amount = amount;
    } else {
      sum += value;
      if (recyclability == 1 && type_residue <= 3) {
        amount = value * this.rates[type_residue - 1].price;
      } else if (recyclability == 2 && (type_residue <= 3 || type_residue == 5)) {
        amount = value * this.rates[3].price
      } else {
        amount = 0;
      }
      this.detailForm.push({ precedence, hazard, value, type_residue, amount, recyclability });
    }

    if (recyclability == 1 && type_residue <= 3) {
      amount = ((this.rates[type_residue - 1].price) * sum).toString();
    } else if (recyclability == 2 && (type_residue <= 3 || type_residue == 5)) {
      amount = (((this.rates[3].price) * sum)).toString();
    } else {
      amount = "0";
    }

    sessionStorage.setItem('detailForm', JSON.stringify(this.detailForm));

    (document.getElementById(`actual_weight_${recyclability}_${type_residue}`) as HTMLInputElement).value = `${sum.toFixed(2).replace(".", ",")}`;

    const last_weight = parseFloat((document.getElementById(`last_weight_${recyclability}_${type_residue}`) as HTMLElement).innerHTML.replace(",", "."));
    const diff = sum - last_weight;
    (document.getElementById(`actual_dif_${recyclability}_${type_residue}`) as HTMLInputElement).value = `${diff == Infinity ? 100 : (diff.toFixed(2).replace(".", ",")) || 0} `;
    this.calculateDiff();
  }

  getValueStatementByYear() {
    const year = this.year_statement - 1;
    this.productorService.getValueStatementByYear(this.id_business, year, 0).subscribe({
      next: r => {
        if (!r.status) {
          Swal.close();
          Swal.fire({
            title: 'Tuvimos problemas',
            text: r.msg,
            icon: 'error'
          }).then(event => {
            if (event.isConfirmed) {
              this.router.navigate(['/productor/home']);
            }
          })
        }
        this.detailLastForm = r.data.detail;
        sessionStorage.setItem('detailLastForm', JSON.stringify(this.detailLastForm) || '""');
        this.headLastForm = r.data.health;
        Swal.close();
        this.detailLastForm?.forEach(r => {
          (document.getElementById(`inp_l_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}_${r?.PRECEDENCE}_${r?.HAZARD}`) as HTMLElement).innerHTML = r?.VALUE.toFixed(2).replace(".", ",");
          const tmp_weight = (parseFloat((document.getElementById(`last_weight_${r?.RECYCLABILITY}_${r?.TYPE_RESIDUE}`) as HTMLElement).innerHTML.replace(",", ".")) || 0) + parseFloat(r?.VALUE);
          (document.getElementById(`last_weight_${r?.RECYCLABILITY}_${r.TYPE_RESIDUE}`) as HTMLElement).innerHTML = tmp_weight.toFixed(2).replace(".", ",");
        });
      },
      error: r => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          text: r.msg,
          title: '¡Ups!'
        });
      }
    });
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

  async saveFile() {
    const selectedMaterial = this.userForm.get('MV').value;
    if (this.fileCountByMaterial[selectedMaterial] >= 3) {
      Swal.fire({
        icon: 'error',
        title: 'Límite Alcanzado',
        text: 'No puedes subir más de 3 archivos para el tipo de material seleccionado.'
      });
      return; // Detener la ejecución si se alcanza el límite
    }

    const tmp = sessionStorage.getItem('detailForm');
    const detail = JSON.parse(tmp ? tmp : "[]");
    const materialHasValues = detail.some((item:any) => item.recyclability === 3 && item.type_residue === parseInt(selectedMaterial));
    if (!materialHasValues) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'El material no tiene valores ingresados.'
      });
      return;
    }

    if (this.id_statement == null) {
      Swal.fire({
        title: 'Guardando Datos',
        text: `Se están guardando datos`,
        timerProgressBar: true,
        showConfirmButton: false
      });
      Swal.showLoading();
      const header = {
        id_business: this.id_business,
        year_statement: this.year_statement,
        state: false,
        id_statement: this.id_statement
      };

      const tmp = sessionStorage.getItem('detailForm');
      const detail = JSON.parse(tmp ? tmp : "[]");
      if (detail.length == 0) {
        detail.push({ precedence: 1, hazard: 1, recyclability: 1, type_residue: 1, value: 0, amount: 0 });
      }
      sessionStorage.setItem('saving', 'true');
      const r = await this.productorService.saveForm({ header, detail }).toPromise();
      if (r.status) {
        sessionStorage.setItem('id_statement', r.data);
        this.id_statement = r.data;
        Swal.close()
      }
      sessionStorage.removeItem('isEdited');
      sessionStorage.removeItem('saving');
      this.productorService.saveFile(this.id_statement, this.fileName, this.fileBuffer, selectedMaterial).subscribe(r => {
        if (r.status) {
          Swal.fire({
            icon: 'success',
            text: 'Medio de verificación guardado satisfactoriamente'
          })
          this.loadMV();
        }
      });
      this.fileCountByMaterial[selectedMaterial]++;
    }
    else {
      this.productorService.saveFile(this.id_statement, this.fileName, this.fileBuffer, selectedMaterial).subscribe(r => {
        if (r.status) {
          Swal.fire({
            icon: 'success',
            text: 'Medio de verificación guardado satisfactoriamente'
          })
          this.loadMV();
        }
      })
    }
  }

  deleteMV(id: any) {
    this.productorService.deleteById(id).subscribe(r => {
      if (r.status) {
        Swal.fire({
          icon: 'info',
          text: 'Medio de verificación eliminado satisfactoriamente'
        })
        this.loadMV();
      }
    })
  }

  loadMV() {
    this.productorService.getMV(this.id_statement).subscribe(r => {
      if (r.status) {
        this.MV_consulta = r.data.header;
        this.fileCountByMaterial = {
          1: 0, // "Papel/Cartón"
          2: 0, // "Metal"
          3: 0  // "Plástico"
        };

        this.MV_consulta.forEach((mv: any) => {
          if (this.fileCountByMaterial.hasOwnProperty(mv.TYPE_MATERIAL)) {
            this.fileCountByMaterial[mv.TYPE_MATERIAL]++;
          }
        });

        // Establecer variables en sessionStorage
        sessionStorage.setItem('hasMV_PapelCarton', this.fileCountByMaterial[1] > 0 ? 'true' : 'false');
        sessionStorage.setItem('hasMV_Metal', this.fileCountByMaterial[2] > 0 ? 'true' : 'false');
        sessionStorage.setItem('hasMV_Plastico', this.fileCountByMaterial[3] > 0 ? 'true' : 'false');
      }
    });
  }
}