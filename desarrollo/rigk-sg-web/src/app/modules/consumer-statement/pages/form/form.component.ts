import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentService } from '../../../../core/services/establishment.service';
import { ConsumerService } from '../../../../core/services/consumer.service';
import Swal from 'sweetalert2';
import { ManagerService } from 'src/app/core/services/manager.service';
import { BusinessService } from 'src/app/core/services/business.service';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  selectedCategoryId: any = '';
  lastRowNumber: number = 0;
  tables = [""];
  e = 1;
  materials: any = [];
  materials_2 = [];
  categories = [];
  treatments = [];
  disableAll = false;
  treatment_type = [
    "Reciclaje Mecánico",
    "Valorización Energética",
    "Disposición Final en RS",
    "Reciclaje Interno",
    "Preparación Reutilización",
    "DF en Relleno Sanitario",
    "DF en Relleno Seguridad"
  ];
  total_tables = [0, 0, 0];
  id_establishment = -1;
  region = "";
  comuna = "";
  establishments: any[] = [];
  selectedEstablishment: any = [];
  attached: any[] = [];
  managers: any[] = [];
  id_business = "0";
  year_statement = 0;
  establishment = "";
  goTo = '/consumidor/';
  data: { table: number, residue: number, val: number, date_withdraw: string, id_gestor: number, ler: string, treatment_type: number }[] = [];
  lable_type = ['Guia de Despacho', 'Factura Gestor', 'Registro de peso', 'Fotografía Retiro', 'Balance de masas', 'Otro'];
  business_name = "";
  business_code = "";
  userData: any;
  id_compare: any;
  constructor(public establishmentService: EstablishmentService,
    public consumerService: ConsumerService,
    public business: BusinessService,
    private router: Router,
    private actived: ActivatedRoute,
    private managerService: ManagerService) {
    this.actived.data.subscribe((r: any) => {
      if (r.show) {
        const id = this.actived.snapshot.params['id'];
        this.disableAll = true;
      } else {
        this.actived.queryParams.subscribe(r => {
          this.id_business = r['id_business'];
          this.year_statement = r['year'];
          this.business_code = r['code'];
          this.loadEstablishments();
          this.business.getBusiness(r['code']).subscribe(e => {
            this.business_name = e.status[0].NAME;
          })
        });
      }
    });
  }
  ngOnInit(): void {
    localStorage.removeItem('statementsState');
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.getAllSubmaterialFormatted();
    this.getAllSubmaterial();
    this.getAllMaterials();
    this.getAllTreatments();
  }
  getAllSubmaterialFormatted() {
    this.managerService.getAllSubmaterialFormatted().subscribe(r => {
      if (r.status) {
        this.materials = r.data;
      }
    });
  }

  getAllSubmaterial() {
    this.managerService.getAllSubmaterial().subscribe(r => {
      if (r.status) {
        this.materials_2 = r.data;
      }
    });
  }

  getAllMaterials() {
    this.managerService.getAllMaterials().subscribe(r => {
      if (r.status) {
        this.categories = r.status;
      }
    });
  }

  getAllTreatments() {
    this.managerService.getAllTreatments().subscribe(r => {
      if (r.status) {
        this.treatments = r.status;
      }
    });
  }
  reset() {
    this.id_establishment = -1;
    const tb_ref_1 = document.getElementById(`table_1`)?.getElementsByTagName('tbody')[0];

    const all: any = tb_ref_1?.rows;
    while (all.length != 0) {
      tb_ref_1?.deleteRow(0);
    }
    this.selectedEstablishment = null;
    document.getElementById(`table_td_1`)!.innerHTML = "0";
    this.newData = [];
  }
  getManagersForMaterial(materialId: number): any[] {
    const managersForMaterial = this.managers.find(m => m.material === materialId)?.managers || [];
    return managersForMaterial.map(
      (manager: { ID_BUSINESS: any, BUSINESS_NAME: any; }) => { return { name: manager.BUSINESS_NAME, id: manager.ID_BUSINESS } || { name: "Reciclaje Interno", id: 0 } });
  }
  onEstablishmentChange(event: any) {
    this.establishmentService.getEstablishmentByID(this.selectedEstablishment[0]).subscribe(r => {
      if (r.status) {
        this.id_compare = r.status[0].ID;
        this.region = r.status[0].REGION;
        this.comuna = r.status[0].COMUNA_NAME;
        this.id_establishment = r.status[0].ID_VU ? r.status[0].ID_VU : '-';
        this.fetchManagersForAllMaterials(r.status[0].REGION);
      }
      else {
        this.managers = [];
      }
    });
  }

  fetchManagersForAllMaterials(region: any) {
    const materialIds = this.materials_2
      .filter((material: any) => material.id !== undefined)
      .map((material: any) => material.id);

    this.managerService.getManagersByMaterials(materialIds, region).subscribe(results => {
      if (Array.isArray(results.status)) {
        this.managers = results.status.map((item: any) => ({
          material: item.COD_MATERIAL,
          managers: item.BUSINESS_NAME,
          id_gestor: item.ID_BUSINESS
        }));
      } else {
        console.error('results.status no es un array');
      }
    });
  }

  loadEstablishments() {
    if (this.id_business == "0") return;
    this.establishmentService.getEstablishment(this.id_business.toString()).subscribe({
      next: r => {
        this.establishments = [];
        r.status.forEach((e: any) => {
          e.name = `${e.NAME_ESTABLISHMENT} - ${e.NAME_COMMUNE} - ${e.REGION}`;
          this.establishments.push(e);
        });
      }
    });
  }
  async saveForm() {
    if (this.newData.length == 0) {
      Swal.fire({
        icon: 'info',
        text: 'Formulario está vacío'
      })
      return;
    }
    // verify data
    let error = null;
    if (!this.selectedEstablishment[0] || this.selectedEstablishment[0] == 0) {
      error = 'Falta establecimiento';
    }
    Swal.fire({
      icon: 'info',
      title: 'Espere...',
      text: `Enviando formulario`
    });
    Swal.showLoading();
    for (let i = 0; i < this.newData.length; i++) {
      const reg = this.newData[i];
      const selectedDateType = reg.dateType;
      let dateToValidate = '';
      if (selectedDateType === '0') { // Fecha precisa
        dateToValidate = reg.date;
        reg.mdate = "";
        for (let i = 0; i < this.newData.length; i++) {
          if (this.newData[i].value == 0 || this.newData[i].date == "" || this.newData[i].gestor == "-1" || this.newData[i].treatment == "-1" || this.newData[i].sub == "-1" || this.newData[i].precedence == "-1") {
            if (this.newData[i].precedence == "-1") {
              error = "Debe seleccionar una Subcategoria";
              break;
            }
            if (this.newData[i].treatment == "-1") {
              error = "Debe seleccionar un Tipo Tratamiento";
              break;
            }
            if (this.newData[i].sub == "-1") {
              error = "Debe seleccionar un SubTipo";
              break;
            }
            if (this.newData[i].value == 0) {
              error = "Debe ingresar un peso correcto";
              break;
            }
            if (this.newData[i].date == "" && this.newData[i].dateType== '0') {
              error = "Debe ingresar una fecha de retiro";
              break;
            }
            if (this.newData[i].gestor == "-1") {
              error = "Debe seleccionar un gestor";
              break;
            }
          }
        }

        if (error != null) {
          Swal.fire({
            icon: 'info',
            text: error
          });
          return;
        }

      } else if (selectedDateType === '1') { // Todo el mes
        dateToValidate = reg.mdate;
        reg.date = `${reg.mdate}-01`;
        for (let i = 0; i < this.newData.length; i++) {

          if (this.newData[i].value == 0 || this.newData[i].mdate == "" || this.newData[i].gestor == "-1" || this.newData[i].treatment == "-1" || this.newData[i].sub == "-1" || this.newData[i].precedence == "-1") {
            if (this.newData[i].precedence == "-1") {
              error = "Debe seleccionar una Subcategoria";
              break;
            }
            if (this.newData[i].treatment == "-1") {
              error = "Debe seleccionar un Tipo Tratamiento";
              break;
            }
            if (this.newData[i].sub == "-1") {
              error = "Debe seleccionar un SubTipo";
              break;
            }
            if (this.newData[i].value == 0) {
              error = "Debe ingresar un peso correcto";
              break;
            }
            if (this.newData[i].mdate == "" && this.newData[i].dateType== '1') {
              error = "Debe ingresar una mes de retiro";
              break;
            }
            if (this.newData[i].gestor == "-1") {
              error = "Debe seleccionar un gestor";
              break;
            }
          }
        }

        if (error != null) {
          Swal.fire({
            icon: 'info',
            text: error
          });
          return;
        }
      } else {
          error = "Debe seleccionar un tipo de fecha";

          if (error != null) {
            Swal.fire({
              icon: 'info',
              text: error
            });
            return;
          }
        }
      }
      
      let flag = false;
    let savedSuccessfully = [];
    let saveErrors = [];
    for (let i = 0; i < this.newData.length; i++) {
      const header = { year: this.year_statement, establishment: this.selectedEstablishment[0] };
      const e = this.newData[i];
      e.residue = e.precedence;
      try {
        const r: any = await this.consumerService.save({ header, detail: e }).toPromise();
        if (r.status) {
          savedSuccessfully.push(e);
        } else {
          saveErrors.push(e);
        }
      } catch (error) {
        saveErrors.push(e);
      }
    }

    if (saveErrors.length > 0) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        text: `Ocurrió un error mientras se enviaban algunas declaraciones. Se guardaron correctamente ${savedSuccessfully.length} de ${this.newData.length} declaraciones. Consultar en "Consulta de declaración" cuales fueron ingresadas.`
      }).then(btn => {
        if (btn.isConfirmed) {
          this.router.navigate(['/consumidor']);
        }
      });
    } else {
      Swal.close();
      Swal.fire({
        icon: 'success',
        text: 'Declaración guardada satisfactoriamente'
      }).then(btn => {
        if (btn.isConfirmed) {
          this.router.navigate(['/consumidor']);
        }
      });
    }
  }

    goBack() {
      this.router.navigate([this.goTo]);
    }
    getId(element: any) {
      alert("row" + element.parentNode.parentNode.rowIndex +
        " - column" + element.parentNode.cellIndex);
    }
    newData: any[] = [];
    rowSelected = 0;
    tableSelected = 0;
    verifyRow(data: any, input: HTMLInputElement) {
      if (data.dateType == "0") {
        data.mdate = "";
      }
      this.consumerService.checkRow(data).subscribe({
        next: r => {
          if (!r.status) {
            Swal.fire({
              icon: 'info',
              html: `
                <h2 style="font-weight: bold;">Advertencia de Duplicidad de declaración.</h2>
                <p style="text-align: justify;">
                  Ya existe una declaración para la misma Empresa, Establecimiento, Material, Subtipo, y Gestor en esta Fecha. 
                  Si desea continuar con esta declaración de características similares a una anterior, pinche OK. De lo contrario, pinche Cancelar.
                </p>
              `,
              showCancelButton: true,
              confirmButtonText: 'Ok',
              cancelButtonText: 'Cancelar'
            }).then((result) => {
              if (!result.isConfirmed) {
                input.value = "-1";
                switch(data.nameColumn){
                    case 'date': this.newData[data.index - 1].date = "";
                    break;
                    case 'mdate': this.newData[data.index - 1].mdate = "";
                    break;
                    case 'treatment': this.newData[data.index - 1].treatment = "-1";
                    break;
                    case 'gestor': this.newData[data.index - 1].gestor = "-1";
                    break;
                    case 'sub': this.newData[data.index - 1].sub = '-1'
                    break;
                }
              }
            });
          }
        }
      });
    }

    onDateTypeChange(event: Event, i: number, n_row: number): void {
      const selectedValue = (event.target as HTMLSelectElement).value;

      // Encuentra los inputs correspondientes usando las nuevas clases
      const fechaRetiroInput = document.getElementById(`inp_date_${i}_${n_row}`) as HTMLElement;
      const mesRetiroInput = document.getElementById(`inp_mdate_${i}_${n_row}`) as HTMLElement;

      if(selectedValue === '0') { // Fecha precisa
      fechaRetiroInput.classList.remove('d-none');
      mesRetiroInput.classList.add('d-none');
    } else if (selectedValue === '1') { // Todo el mes
      mesRetiroInput.classList.remove('d-none');
      fechaRetiroInput.classList.add('d-none');
    } else {
      fechaRetiroInput.classList.add('d-none');
      mesRetiroInput.classList.add('d-none');
    }
  }

  addRow(i: number) {
    this.lastRowNumber++;
    const tb_ref = document.getElementById(`table_${i + 1}`)?.getElementsByTagName('tbody')[0];
    let n_row: any = this.lastRowNumber;

    let html: string = `
    <tr id="tr">
                        <td>
                          <select class="form-select" id="inp_subcat_${i + 1}_${n_row}">
                            <option value="-1">Seleccione Subcategoría</option>`;

    this.categories.forEach((category: any) => {
      html += `<option value="${category.ID}">${category.MATERIAL}</option>`;
    });
    html += `
                          </select>
                        </td>
                        <td style="padding-left: 20px;">
                            <select class="form-select" id="inp_treatment_${i + 1}_${n_row}">
                                <option value="-1">Seleccione Tratamiento</option>`;
    this.treatments.forEach((category: any) => {
      html += `<option value="${category.ID}">${category.NAME}</option>`;
    });
    html += `   
                            </select>
                        </td>
                        <td>
                            <select class="form-select" id="inp_sub_${i + 1}_${n_row}">
                                <option value="-1">Seleccione Subtipo</option>
                            </select>
                        </td>
                        <td>
                            <input [disabled]="disableAll" class="form-control form-control-sm text-end w-50px"
                                id="inp_value_${i + 1}_${n_row}" type="text" value="0"
                                >
                        </td>
                        <td>
                        <select class="form-select" id="inp_dateType_${i + 1}_${n_row}">
                            <option value="-1">Seleccione Tipo de fecha</option>
                            <option value="0">Fecha precisa</option>
                            <option value="1">Todo el mes</option>
                        </select>
                        </td>
                        <td>
                            <input [disabled]="disableAll" class="form-control text-start w-auto fecha-retiro-input d-none"
                                type="date" id="inp_date_${i + 1}_${n_row}" placeholder="00/00/0000">
                        </td>
                        <td>
                            <input [disabled]="disableAll" class="form-control text-start w-auto mes-retiro-input d-none"
                                type="month" id="inp_mdate_${i + 1}_${n_row}" placeholder="MM/YYYY">
                        </td>
                        <td>
                            <select [disabled]="disableAll" class="form-select w-auto" id="inp_gestor_${i + 1}_${n_row}"
                                >
                                <option value="-1" selected>Seleccione</option>
                                <option value="0">Reciclaje Interno</option>
                                <!-- <option *ngFor="let manager of getManagersForMaterial(type.id)" [value]="manager">{{
                                    manager }}</option> -->
                            </select>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" id="btn_${i + 1}_${n_row}_modal">Ver</button>
                        </td>
                        <td>
                            <!-- eliminar -->
                            <button class="btn btn-sm btn-danger" id="btn_${i + 1}_${n_row}">X</button>
                        </td>
                    </tr>
    `;
    const newRow = tb_ref?.insertRow(tb_ref.rows.length);
    newRow!.innerHTML = html;
    const btn = document.getElementById(`btn_${i + 1}_${n_row}`);
    const btn_modal = document.getElementById(`btn_${i + 1}_${n_row}_modal`);
    const tmp: any[] = this.newData;
    const e = {
      precedence: -1,
      row: n_row,
      residue: 1,
      sub: "-1",
      treatment: "-1",
      ler: "",
      value: 0,
      date: "",
      mdate: "",
      gestor: "-1",
      files: [],
      dateType: ""
    };
    tmp.push(e);
    const analize = (treatment: any, sub: any, gestor: any, date: any, row: any, idEstablishment: any, mdate: any, dateType: any, index: any, nameColumn: any) => {
      this.verifyRow({ treatment, sub, gestor, date, idEstablishment, mdate, dateType, index, nameColumn }, row);
    }

    const selectDateType = document.getElementById(`inp_dateType_${i + 1}_${n_row}`) as HTMLSelectElement;
    selectDateType.addEventListener('change', (event) => {
      this.onDateTypeChange(event, i + 1, n_row);
    });

    const inp_treatment = (document.getElementById(`inp_treatment_${i + 1}_${n_row}`) as HTMLInputElement);
    inp_treatment.onchange = () => {
      let tmp_filter = 0;
      for (let j = 0; j < tmp.length; j++) {
        const i = tmp[j];
        if (i.row == n_row) continue;
        if (i.sub == inp_sub.value && i.gestor == inp_gestor.value && i.treatment == inp_treatment.value && i.date == inp_date.value && i.precedence == inp_subcat.value && i.dateType == '0' && i.date != "") {
          tmp_filter++;
        } else if (i.sub == inp_sub.value && i.gestor == inp_gestor.value && i.treatment == inp_treatment.value && i.mdate == inp_mdate.value && i.precedence == inp_subcat.value && i.dateType == '1' && i.mdate != "") {
          tmp_filter++;
        }
      }
      if (tmp_filter >= 1) {
        Swal.fire({
          icon: 'info',
          html: `
            <h2 style="font-weight: bold;">Advertencia de Duplicidad de declaración.</h2>
            <p style="text-align: justify;">
              Ya existe una declaración para la misma Empresa, Establecimiento, Material, Subtipo, y Gestor en esta Fecha. 
              Si desea continuar con esta declaración de características similares a una anterior, pinche OK. De lo contrario, pinche Cancelar.
            </p>
          `,
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (!result.isConfirmed) {
            inp_treatment.value = "0";
            return;
          }
        });
      } else {
        analize(inp_treatment.value, inp_sub.value, inp_gestor.value, inp_date.value, inp_treatment, this.id_compare, inp_mdate.value, inp_dateType.value, n_row, 'treatment');
      }
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          precedence: "-1",
          row: n_row,
          residue: (i + 1),
          sub: "-1",
          treatment: inp_treatment.value,
          ler: "",
          value: 0,
          date: "",
          mdate: "",
          gestor: "-1",
          files: [],
          dateType: ""
        };
        tmp.push(e);
      } else {
        tmp[w].treatment = inp_treatment.value;
      }
    }
    function removeOptions(selectElement: any) {
      var i, L = selectElement.options.length - 1;
      for (i = L; i >= 0; i--) {
        selectElement.remove(i);
      }
    }


    const inp_subcat = (document.getElementById(`inp_subcat_${i + 1}_${n_row}`) as HTMLInputElement);
    inp_subcat.onchange = () => {
      this.selectedCategoryId = parseInt(inp_subcat.value);
      const selectedCategory = this.materials.find((mat: any) => mat._id === this.selectedCategoryId);
      const subMaterials = selectedCategory ? selectedCategory.child : [];

      removeOptions(inp_sub);

      let defaultOption = document.createElement('option');
      defaultOption.value = "-1";
      defaultOption.innerHTML = "Seleccione Subtipo";
      inp_sub.appendChild(defaultOption);
      subMaterials.forEach((material: any) => {
        let opt = document.createElement('option');
        opt.value = material.id.toString();
        opt.innerHTML = material.name;
        inp_sub.appendChild(opt);
      });
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          precedence: this.selectedCategoryId,
          row: n_row,
          residue: (i + 1),
          sub: "-1",
          treatment: "-1",
          ler: "",
          value: 0,
          date: "",
          mdate: "",
          gestor: "-1",
          files: [],
          dateType: ""
        };
        tmp.push(e);
      } else {
        tmp[w].precedence = this.selectedCategoryId;
        tmp[w].sub = "-1";
        tmp[w].gestor = "-1";
      }

      updateGestorOptions();
    };


    const inp_sub = (document.getElementById(`inp_sub_${i + 1}_${n_row}`) as HTMLInputElement);
    inp_sub.onchange = () => {
      let tmp_filter = 0;
      for (let j = 0; j < tmp.length; j++) {
        const i = tmp[j];
        if (i.row == n_row) continue;
        if (i.sub == inp_sub.value && i.gestor == inp_gestor.value && i.treatment == inp_treatment.value && i.date == inp_date.value && i.precedence == inp_subcat.value && i.dateType == '0' && i.date != "") {
          tmp_filter++;
        } else if (i.sub == inp_sub.value && i.gestor == inp_gestor.value && i.treatment == inp_treatment.value && i.mdate == inp_mdate.value && i.precedence == inp_subcat.value && i.dateType == '1' && i.mdate != "") {
          tmp_filter++;
        }
      }
      if (tmp_filter >= 1) {
        Swal.fire({
          icon: 'info',
          html: `
            <h2 style="font-weight: bold;">Advertencia de Duplicidad de declaración.</h2>
            <p style="text-align: justify;">
              Ya existe una declaración para la misma Empresa, Establecimiento, Material, Subtipo, y Gestor en esta Fecha. 
              Si desea continuar con esta declaración de características similares a una anterior, seleccione OK. De lo contrario, seleccione Cancelar.
            </p>
          `,
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (!result.isConfirmed) {
            inp_sub.value = "0";
            return;
          }
        });
      } else {
        analize(inp_treatment.value, inp_sub.value, inp_gestor.value, inp_date.value, inp_sub, this.id_compare, inp_mdate.value, inp_dateType.value, n_row, 'sub');
      }
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          precedence: "-1",
          row: n_row,
          residue: (i + 1),
          sub: inp_sub.value,
          treatment: "-1",
          ler: "",
          value: 0,
          date: "",
          mdate: "",
          gestor: "-1",
          files: [],
          dateType: ""
        };
        tmp.push(e);
      } else {
        tmp[w].sub = inp_sub.value;
      }
    }


    function updateGestorOptions() {
      removeOptions(inp_gestor);

      let defaultOption = document.createElement('option');
      defaultOption.value = "-1";
      defaultOption.innerHTML = "Seleccione";
      inp_gestor.appendChild(defaultOption);

      let internalRecycleOption = document.createElement('option');
      internalRecycleOption.value = "0";
      internalRecycleOption.innerHTML = "Reciclaje Interno";
      inp_gestor.appendChild(internalRecycleOption);

      const gestorsForCategory = getGestorsForCategory(inp_subcat.value);
      gestorsForCategory.forEach(gestor => {
        let opt = document.createElement('option');
        opt.value = gestor.id_gestor;
        opt.innerHTML = gestor.name;
        inp_gestor.appendChild(opt);
      });
    }

    const getGestorsForCategory = (categoryId: string): any[] => {
      const filteredManagers = this.managers.filter(m => m.material === categoryId);
      const gestors = filteredManagers.map(m => {
        return {
          id: m.material,
          name: m.managers,
          id_gestor: m.id_gestor
        };
      });

      return gestors;
    }

    const inp_value = (document.getElementById(`inp_value_${i + 1}_${n_row}`) as HTMLInputElement);
    inp_value.onchange = () => {
      inp_value.value = inp_value.value.replace(".", ",");
      const pattern = /^[0-9]+(,[0-9]+)?$/;
      if (!pattern.test(inp_value.value)) {
        Swal.fire({
          icon: 'info',
          text: 'Solo se admiten números'
        });
        inp_value.value = "0";
      }
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          precedence: "-1",
          row: n_row,
          residue: (i + 1),
          sub: "-1",
          treatment: "-1",
          ler: "",
          value: inp_value.value,
          date: "",
          mdate: "",
          gestor: "-1",
          files: [],
          dateType: ""
        };
        tmp.push(e);
      } else {
        tmp[w].value = inp_value.value;
      }
      let sum = 0;
      for (let y = 0; y < tmp.length; y++) {
        const u = tmp[y];
        if (u.residue != i + 1) continue;
        sum += parseFloat(u.value.toString().replace(",", "."));
      }
      document.getElementById(`table_td_${i + 1}`)!.innerHTML = sum.toFixed(2).toString().replace(".", ",");
    }

    const inp_dateType = (document.getElementById(`inp_dateType_${i + 1}_${n_row}`) as HTMLSelectElement);
    inp_dateType.onchange = () => {
      const selectedValue = inp_dateType.value;
      // let tmp_filter = 0;

      for (let j = 0; j < tmp.length; j++) {
        const i = tmp[j];
        if (i.row == n_row) continue;
      }

      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          precedence: "-1",
          row: n_row,
          residue: (i + 1),
          sub: "-1",
          treatment: "-1",
          ler: "",
          value: 0,
          date: "",
          mdate: "",
          gestor: "-1",
          files: [],
          dateType: selectedValue
        };
        tmp.push(e);
      } else {
        tmp[w].dateType = selectedValue;
      }
    }

    const inp_date = (document.getElementById(`inp_date_${i + 1}_${n_row}`) as HTMLInputElement);
    inp_date.onchange = () => {
      let tmp_filter = 0;
      for (let j = 0; j < tmp.length; j++) {
        const i = tmp[j];
        if (i.row == n_row) continue;
        if (i.sub == inp_sub.value && i.gestor == inp_gestor.value && i.treatment == inp_treatment.value && i.date == inp_date.value && i.precedence == inp_subcat.value && i.dateType == '0' && i.date != "") {
          tmp_filter++;
        } else if (i.sub == inp_sub.value && i.gestor == inp_gestor.value && i.treatment == inp_treatment.value && i.mdate == inp_mdate.value && i.precedence == inp_subcat.value && i.dateType == '1' && i.mdate != "") {
          tmp_filter++;
        }
      }
      if (tmp_filter >= 1) {
        Swal.fire({
          icon: 'info',
          html: `
            <h2 style="font-weight: bold;">Advertencia de Duplicidad de declaración.</h2>
            <p style="text-align: justify;">
              Ya existe una declaración para la misma Empresa, Establecimiento, Material, Subtipo, y Gestor en esta Fecha. 
              Si desea continuar con esta declaración de características similares a una anterior, pinche OK. De lo contrario, pinche Cancelar.
            </p>
          `,
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (!result.isConfirmed) {
            inp_date.value = "";
            return;
          }
        });
      } else {
        analize(inp_treatment.value, inp_sub.value, inp_gestor.value, inp_date.value, inp_date, this.id_compare, inp_mdate.value, inp_dateType.value, n_row, 'date');
      }
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          precedence: "-1",
          row: n_row,
          residue: (i + 1),
          sub: "-1",
          treatment: "-1",
          ler: "",
          value: 0,
          date: inp_date.value,
          mdate: "",
          gestor: "-1",
          files: [],
          dateType: ""
        };
        tmp.push(e);
      } else {
        tmp[w].date = inp_date.value;
      }
    }

    const inp_mdate = (document.getElementById(`inp_mdate_${i + 1}_${n_row}`) as HTMLInputElement);
    inp_mdate.onchange = () => {
      let tmp_filter = 0;
      for (let j = 0; j < tmp.length; j++) {
        const i = tmp[j];
        if (i.row == n_row) continue;
        if (i.sub == inp_sub.value && i.gestor == inp_gestor.value && i.treatment == inp_treatment.value && i.date == inp_date.value && i.precedence == inp_subcat.value && i.dateType == '0' && i.date != "") {
          tmp_filter++;
        } else if (i.sub == inp_sub.value && i.gestor == inp_gestor.value && i.treatment == inp_treatment.value && i.mdate == inp_mdate.value && i.precedence == inp_subcat.value && i.dateType == '1' && i.mdate != "") {
          tmp_filter++;
        }
      }
      if (tmp_filter >= 1) {
        Swal.fire({
          icon: 'info',
          html: `
            <h2 style="font-weight: bold;">Advertencia de Duplicidad de declaración.</h2>
            <p style="text-align: justify;">
              Ya existe una declaración para la misma Empresa, Establecimiento, Material, Subtipo, y Gestor en esta Fecha. 
              Si desea continuar con esta declaración de características similares a una anterior, pinche OK. De lo contrario, pinche Cancelar.
            </p>
          `,
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (!result.isConfirmed) {
            inp_mdate.value = "";
            return;
          }
        });
      } else {
        analize(inp_treatment.value, inp_sub.value, inp_gestor.value, inp_date.value, inp_mdate, this.id_compare, inp_mdate.value, inp_dateType.value, n_row, 'mdate');
      }
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          precedence: "-1",
          row: n_row,
          residue: (i + 1),
          sub: "-1",
          treatment: "-1",
          ler: "",
          value: 0,
          date: `${inp_mdate.value}-01`,
          mdate: inp_mdate.value,
          gestor: "-1",
          files: [],
          dateType: ""
        };
        tmp.push(e);
      } else {
        tmp[w].mdate = inp_mdate.value;
      }
    }

    const inp_gestor = (document.getElementById(`inp_gestor_${i + 1}_${n_row}`) as HTMLInputElement);
    inp_gestor.onchange = () => {
      let tmp_filter = 0;
      for (let j = 0; j < tmp.length; j++) {
        const i = tmp[j];
        if (i.row == n_row) continue;
        if (i.sub == inp_sub.value && i.gestor == inp_gestor.value && i.treatment == inp_treatment.value && i.date == inp_date.value && i.precedence == inp_subcat.value && i.dateType == '0' && i.date != "") {
          tmp_filter++;
        } else if (i.sub == inp_sub.value && i.gestor == inp_gestor.value && i.treatment == inp_treatment.value && i.mdate == inp_mdate.value && i.precedence == inp_subcat.value && i.dateType == '1' && i.mdate != "") {
          tmp_filter++;
        }
      }
      if (tmp_filter >= 1) {
        Swal.fire({
          icon: 'info',
          html: `
            <h2 style="font-weight: bold;">Advertencia de Duplicidad de declaración.</h2>
            <p style="text-align: justify;">
              Ya existe una declaración para la misma Empresa, Establecimiento, Material, Subtipo, y Gestor en esta Fecha. 
              Si desea continuar con esta declaración de características similares a una anterior, pinche OK. De lo contrario, pinche Cancelar.
            </p>
          `,
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (!result.isConfirmed) {
            inp_gestor.value = "-1";
            return;
          }
        });
      } else {
        analize(inp_treatment.value, inp_sub.value, inp_gestor.value, inp_date.value, inp_gestor, this.id_compare, inp_mdate.value, inp_dateType.value, n_row, 'gestor');
      }
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          precedence: "-1",
          row: n_row,
          residue: (i + 1),
          sub: "-1",
          treatment: "-1",
          ler: "",
          value: 0,
          date: "",
          mdate: "",
          gestor: inp_gestor.value,
          files: [],
          dateType: ""
        };
        tmp.push(e);
      } else {
        tmp[w].gestor = inp_gestor.value;
      }
    }

    btn!.onclick = () => {
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      tmp.splice(w, 1);
      let sum = 0;
      for (let y = 0; y < tmp.length; y++) {
        const u = tmp[y];
        if (u.residue != (i + 1)) continue;
        sum += parseFloat(u.value.toString().replace(",", "."));
      }
      document.getElementById(`table_td_${i + 1}`)!.innerHTML = sum.toFixed(2).toString().replace(".", ",");

      const all: any = tb_ref?.rows;
      for (let j = 0; j < all.length; j++) {
        const e = all[j];
        if (e === newRow) {
          tb_ref?.deleteRow(j);
          break;
        }
      }

    }
    btn_modal!.onclick = () => {
      this.tableSelected = (i + 1);
      this.rowSelected = n_row;
      document.getElementById('id_table_none')!.innerHTML = `${i + 1}`;
      document.getElementById('id_row_none')!.innerHTML = `${n_row}`;
      (document.getElementById('inp_select_mv') as HTMLSelectElement).value = "0";
      (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          precedence: "-1",
          row: n_row,
          residue: (i + 1),
          sub: "-1",
          treatment: "-1",
          ler: "",
          value: 0,
          date: "",
          mdate: "",
          gestor: "-1",
          files: [],
          dateType: ""
        };
        tmp.push(e);
        const ww = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
        this.filess = tmp[ww].files
        return;
      }
      this.filess = tmp[w].files || [];
    }
  }
  tmpFile = [];
  filess: any[] = [];
  addFile() {
    let type = (document.getElementById('inp_select_mv') as HTMLInputElement).value;
    if (!type || type == "0") {
      Swal.fire({
        icon: 'info',
        text: 'Es necesario seleccionar Tipo MV'
      });
      return;
    }
    if (this.tmpFile.length == 0) {
      Swal.fire({
        icon: 'info',
        text: 'Es necesario seleccionar archivo'
      });
      return;
    }
    const q = this.newData.findIndex(r => r.residue == this.tableSelected && r.row == this.rowSelected);
    if (q == -1) {
      Swal.fire({
        icon: 'error',
        text: 'Ocurrió un error!.'
      });
      return;
    }
    if (this.newData[q].files.length == 3) {
      Swal.fire({
        icon: 'info',
        text: 'Se permite máximo 3 medios de verificación'
      });
      (document.getElementById('inp_select_mv') as HTMLInputElement).value = "0";
      (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
      return;
    }

    if ((this.newData[q].files as any[]).findIndex(t => t.type == type) > -1) {
      Swal.fire({
        icon: 'warning',
        text: 'Tipo de Medio de Verificación ya fue agregado'
      });
      (document.getElementById('inp_select_mv') as HTMLInputElement).value = "0";
      (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
      return;
    }
    this.newData[q].files.push({ type, file: this.tmpFile[0] });
    (document.getElementById('inp_select_mv') as HTMLInputElement).value = "0";
    (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
    this.tmpFile = [];
  }
  selectFile(event: any) {
    const target = event.target;

    if (target.files.length == 0) {
      (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
      this.tmpFile = [];
    }
    if (target.files[0].size / 1000 > 1000) {
      Swal.fire({
        icon: 'info',
        text: 'Archivo excede el tamaño permitido (1Mb).'
      });
      (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
      return;
    }
    const tmp = target.files[0].type.split('/');
    if (tmp.length == 2 && (tmp[1] != 'jpeg' && tmp[1] != 'jpg' && tmp[1] != 'pdf')) {
      Swal.fire({
        icon: 'info',
        text: 'Tipo de archivo no permitido. Sólo se permiten extensiones jpg, jpeg o pdf'
      });
      (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
      return;
    }
    this.tmpFile = event.target.files;
  }
  deleteFile(file: any) {
    const i = this.newData.findIndex(r => r.residue == this.tableSelected && r.row == this.rowSelected);
    if (i > -1) {
      if (this.newData[i].files) {
        const j = (this.newData[i].files as any[]).findIndex(f => f.type == file.type && f.file.name == file.file.name);
        if (j == -1) alert("aa");
        (this.newData[i].files as any[]).splice(j, 1);
      }
    }
  }
}
