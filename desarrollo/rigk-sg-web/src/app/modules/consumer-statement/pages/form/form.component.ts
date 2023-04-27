import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentService } from '../../../../core/services/establishment.service';
import { ConsumerService } from '../../../../core/services/consumer.service';
import Swal from 'sweetalert2';
import { ManagerService } from 'src/app/core/services/manager.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { BusinessService } from 'src/app/core/services/business.service';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  tables = ["Papel/Cartón", "Metal", "Plástico Total", "Madera"];
  e = 1;
  materials = [
    {
      _id: 1,
      child: [
        { id: 1, name: "Papel" },
        { id: 2, name: "Papel Compuesto (cemento)" },
        { id: 3, name: "Caja Cartón" },
        { id: 4, name: "Otro" },
      ]
    },
    {
      _id: 2,
      child: [
        { id: 5, name: "Envase Aluminio" },
        { id: 6, name: "Malla o Reja (IBC)" },
        { id: 7, name: "Envase Hojalata" },
        { id: 8, name: "Otro" },
      ]
    },
    {
      _id: 3,
      child: [
        { id: 9, name: "Plástico Film Embalaje" },
        { id: 10, name: "Plástico Envases Rígidos (Incl. Tapas)" },
        { id: 11, name: "Plástico Sacos o Maxisacos" },
        { id: 12, name: "Plástico EPS (Poliestireno Expandido)" },
        { id: 13, name: "Plástico Zuncho" },
        { id: 14, name: "Otro" },
      ]
    },
    {
      _id: 4,
      child: [
        { id: 15, name: "Caja de Madera" },
        { id: 16, name: "Pallet de Madera" }
      ]
    },
  ];
  disableAll = false;
  treatment_type = [
    "Reciclaje Mecánico",
    "Valorización Energética",
    "Disposición Final en RS"
  ];
  total_tables = [0, 0, 0];
  id_establishment = -1;
  region = "";
  establishments: any[] = [];
  selectedEstablishment: any = [];
  attached: any[] = [];
  managers: any[] = [];
  id_business = "0";
  year_statement = 0;
  establishment = "";
  goTo = '/consumidor/';
  data: { table: number, residue: number, val: number, date_withdraw: string, id_gestor: number, ler: string, treatment_type: number }[] = [];
  lable_type = ['Guia de Despacho', 'Factura Gestor', 'Registro de peso', 'Fotografía Retiro', 'Otro'];
  business_name = "";
  business_code = "";
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
  }
  reset() {
    this.id_establishment = -1;
    const tb_ref_1 = document.getElementById(`table_1`)?.getElementsByTagName('tbody')[0];
    const tb_ref_2 = document.getElementById(`table_2`)?.getElementsByTagName('tbody')[0];
    const tb_ref_3 = document.getElementById(`table_3`)?.getElementsByTagName('tbody')[0];
    const tb_ref_4 = document.getElementById(`table_4`)?.getElementsByTagName('tbody')[0];

    const all: any = tb_ref_1?.rows;
    const all2: any = tb_ref_2?.rows;
    const all3: any = tb_ref_3?.rows;
    const all4: any = tb_ref_4?.rows;
    while (all.length != 0) {
      tb_ref_1?.deleteRow(0);
    }
    while (all2.length != 0) {
      tb_ref_2?.deleteRow(0);
    }
    while (all3.length != 0) {
      tb_ref_3?.deleteRow(0);
    }
    while (all4.length != 0) {
      tb_ref_4?.deleteRow(0);
    }
    this.selectedEstablishment = null;
    document.getElementById(`table_td_1`)!.innerHTML = "0";
    document.getElementById(`table_td_2`)!.innerHTML = "0";
    document.getElementById(`table_td_3`)!.innerHTML = "0";
    document.getElementById(`table_td_4`)!.innerHTML = "0";
  }
  getManagersForMaterial(materialId: number): any[] {
    const managersForMaterial = this.managers.find(m => m.material === materialId)?.managers || [];
    return managersForMaterial.map(
      (manager: { ID_BUSINESS: any, BUSINESS_NAME: any; }) => { return { name: manager.BUSINESS_NAME, id: manager.ID_BUSINESS } || { name: "Reciclaje Interno", id: 0 } });
  }
  onEstablishmentChange(event: any) {
    this.establishmentService.getEstablishmentByID(this.selectedEstablishment).subscribe(r => {
      if (r.status) {
        this.region = r.status[0].REGION;
        this.id_establishment = r.status[0].ID;
        this.fetchManagersForAllMaterials(r.status[0].REGION);
      }
      else {
        this.managers = [];
      }
    });
  }
  fetchManagersForAllMaterials(region: any) {
    // Crear un array de observables
    const observables = this.materials
      .filter(material => material._id !== undefined) // Filtrar los materiales con id definido
      .map(material => {
        return this.managerService.getManagersByMaterial(material._id, region).pipe(
          map(managers => ({
            material: material._id,
            managers: managers.status
          }))
        );
      });
    // Ejecutar todas las consultas y obtener los resultados una vez que se completen
    forkJoin(observables).subscribe(results => {
      this.managers = results;
    });
  }
  loadEstablishments() {
    if (this.id_business == "0") return;
    this.establishmentService.getEstablishment(this.id_business.toString()).subscribe({
      next: r => {
        this.establishments = [];
        r.status.forEach((e: any) => {
          e.name = `${e.NAME_ESTABLISHMENT} - ${e.REGION}`;
          this.establishments.push(e);
        });
      }
    });
  }
  saveForm() {
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
    for (let i = 0; i < this.newData.length; i++) {
      const reg = this.newData[i];
      if ((reg.value == 0 && (reg.date != "" || reg.gestor > 0 || reg.treatment != "0" || reg.sub != "0"))) {
        error = "Falta ingresar peso";
        break;
      } else if (reg.value > 0 && (reg.date == "" || reg.gestor == 0 || reg.treatment == "0" || reg.sub == "0")) {
        error = "Falta ingresar tipo tratamiento, subtipo, fecha de retiro o gestor";
        break;
      } else if (reg.value == 0 && (reg.date == "" || reg.gestor == 0 || reg.treatment == "0" || reg.sub == "0")) {
        this.newData.splice(i, 1);
        if (this.newData.length == 0) {
          error = "Formulario está vacío";
        }
        break;
      }
    }
    if (error) {
      Swal.fire({
        icon: 'info',
        text: error
      });
      return;
    }

    Swal.fire({
      icon: 'info',
      title: 'Espere...',
      text: `Enviando formulario`
    });
    Swal.showLoading();

    const header = { year: this.year_statement, establishment: this.selectedEstablishment[0] };
    this.consumerService.save({ header, detail: this.newData }).subscribe({
      next: r => {
        Swal.close();
        if (r.status) {
          Swal.fire({
            icon: 'success',
            text: 'Declaración guardada satisfactoriamente'
          }).then(btn => {
            if (btn.isConfirmed) {
              this.router.navigate(['/consumidor']);
            }
          });
        }
      },
      error: r => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          text: 'Ocurrió un error mientras se enviaba el formulario.'
        });
      }
    });
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
  addRow(i: number) {
    const tb_ref = document.getElementById(`table_${i + 1}`)?.getElementsByTagName('tbody')[0];
    const n_row = tb_ref!.rows.length;
    const mat: any = this.materials.find(r => r._id == i + 1);
    let tt = "";
    for (let q = 0; q < mat.child.length; q++) {
      const r = mat.child[q];
      tt += `<option value="${r.id}">${r.name}</option>`
    }
    let tt2 = "";
    const tmp_tt2 = this.getManagersForMaterial(i + 1);
    for (let q = 0; q < tmp_tt2.length; q++) {
      const r = tmp_tt2[q];
      tt2 += `<option value="${r.id}">${r.name}</option>`
    }

    const html: string = `
    <tr id="tr">
                        <td style="padding-left: 20px;">
                            <select class="form-select" id="inp_treatment_${i + 1}_${n_row}">
                                <option value="0">Seleccione Tratamiento</option>
                                <option value="1">Reciclaje Mecánico</option>
                                <option value="2">Valorización Energética</option>
                                <option value="3">Disposición Final en RS</option>
                                
                            </select>
                        </td>
                        <td>
                            <select class="form-select" id="inp_sub_${i + 1}_${n_row}">
                                <option value="0">Seleccione Subtipo</option>
                                ${tt}
                            </select>
                        </td>
                        <td>
                            <input type="text" class="form-control" placeholder="LER" id="inp_ler_${i + 1}_${n_row}">
                        </td>
                        <!-- <td>Papel</td> -->
                        <td>
                            <input [disabled]="disableAll" class="form-control form-control-sm text-end w-50px"
                                id="inp_value_${i + 1}_${n_row}" type="text" value="0"
                                >
                        </td>
                        <td>
                            <input [disabled]="disableAll" class="form-control text-start w-auto" type="date"
                                id="inp_date_${i + 1}_${n_row}" placeholder="00/00/0000"
                                >
                        </td>
                        <td>
                            <select [disabled]="disableAll" class="form-select w-auto" id="inp_gestor_${i + 1}_${n_row}"
                                >
                                <option value="-1" selected>Seleccione</option>
                                <option value="0">Reciclaje Interno</option>
                                ${tt2}
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

    const inp_ler = (document.getElementById(`inp_ler_${i + 1}_${n_row}`) as HTMLInputElement)
    inp_ler.onchange = function () {
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          row: n_row,
          residue: (i + 1),
          sub: "0",
          treatment: "",
          ler: inp_ler.value,
          value: 0,
          date: "",
          gestor: "0",
          files: []
        };
        tmp.push(e);
      } else {
        tmp[i].ler = inp_ler.value;
      }
    }
    const inp_treatment = (document.getElementById(`inp_treatment_${i + 1}_${n_row}`) as HTMLInputElement);
    inp_treatment.onchange = () => {
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          row: n_row,
          residue: (i + 1),
          sub: "0",
          treatment: inp_treatment.value,
          ler: "",
          value: 0,
          date: "",
          gestor: "0",
          files: []
        };
        tmp.push(e);
      } else {
        tmp[i].treatment = inp_treatment.value;
      }
    }
    const inp_sub = (document.getElementById(`inp_sub_${i + 1}_${n_row}`) as HTMLInputElement);
    inp_sub.onchange = () => {
      const q = tmp.findIndex(r => r.residue == (i + 1) && r.sub == inp_sub.value);
      if (q > -1) {
        Swal.fire({
          icon: 'warning',
          text: 'Subtipo ya fue registrado'
        });
        inp_sub.value = "0";
        return;
      }
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          row: n_row,
          residue: (i + 1),
          sub: inp_sub.value,
          treatment: "",
          ler: "",
          value: 0,
          date: "",
          gestor: "0",
          files: []
        };
        tmp.push(e);
      } else {
        tmp[i].sub = inp_sub.value;
      }
    }
    const inp_value = (document.getElementById(`inp_value_${i + 1}_${n_row}`) as HTMLInputElement);
    inp_value.onchange = () => {
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          row: n_row,
          residue: (i + 1),
          sub: "0",
          treatment: "0",
          ler: "",
          value: inp_value.value,
          date: "",
          gestor: "0",
          files: []
        };
        tmp.push(e);
      } else {
        tmp[i].value = inp_value.value;
      }
      let sum = 0;
      for (let y = 0; y < tmp.length; y++) {
        const u = tmp[y];
        sum += parseFloat(u.value.replace(",", "."));
      }
      document.getElementById(`table_td_${i + 1}`)!.innerHTML = sum.toString().replace(".", ",");
    }
    const inp_date = (document.getElementById(`inp_date_${i + 1}_${n_row}`) as HTMLInputElement);
    inp_date.onchange = () => {
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          row: n_row,
          residue: (i + 1),
          sub: "0",
          treatment: "0",
          ler: "",
          value: 0,
          date: inp_date.value,
          gestor: "0",
          files: []
        };
        tmp.push(e);
      } else {
        tmp[i].date = inp_date.value;
      }
    }
    const inp_gestor = (document.getElementById(`inp_gestor_${i + 1}_${n_row}`) as HTMLInputElement);
    inp_gestor.onchange = () => {
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          row: n_row,
          residue: (i + 1),
          sub: "0",
          treatment: "0",
          ler: "",
          value: 0,
          date: "",
          gestor: inp_gestor.value,
          files: []
        };
        tmp.push(e);
      } else {
        tmp[i].gestor = inp_gestor.value;
      }
    }
    btn!.onclick = () => {
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      tmp.splice(w, 1);
      let sum = 0;
      for (let y = 0; y < tmp.length; y++) {
        const u = tmp[y];
        sum += parseFloat(u.value.replace(",", "."));
      }
      document.getElementById(`table_td_${i + 1}`)!.innerHTML = sum.toString().replace(".", ",");

      const all: any = tb_ref?.rows;
      for (let i = 0; i < all.length; i++) {
        const e = all[i];
        if (e == newRow) {
          tb_ref?.deleteRow(i);
          break;
        }
      }
    }
    btn_modal!.onclick = () => {
      this.tableSelected = i + 1;
      this.rowSelected = n_row;
      document.getElementById('id_table_none')!.innerHTML = `${i + 1}`;
      document.getElementById('id_row_none')!.innerHTML = `${n_row}`;
      const w = tmp.findIndex(r => r.row == n_row && r.residue == (i + 1));
      if (w == -1) {
        const e = {
          row: n_row,
          residue: (i + 1),
          sub: "0",
          treatment: "0",
          ler: "",
          value: 0,
          date: "",
          gestor: "0",
          files: []
        };
        tmp.push(e);
        this.filess = [];
        return;
      }
      this.filess = tmp[w].files || [];
    }
  }
  tmpFile = [];
  filess: any[] = [];
  addFile() {
    let type = (document.getElementById('inp_select_mv') as HTMLInputElement).value;
    const q = this.newData.findIndex(r => r.residue == this.tableSelected && r.row == this.rowSelected);
    if (q == -1) {
      return;
    }
    if(this.newData[q].files.length == 3) {
      Swal.fire({
        icon:'info',
        text: 'Se permite máximo 3 medios de verificación'
      });
      (document.getElementById('inp_select_mv') as HTMLInputElement).value = "0";
      (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
      return;
    }
    
    if((this.newData[q].files as any[]).findIndex(t=>t.type == type) > -1) {
      Swal.fire({
        icon:'warning',
        text: 'Tipo de Medio de Verificación ya fue agregado'
      });
      (document.getElementById('inp_select_mv') as HTMLInputElement).value = "0";
      (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
      return;
    }
    this.newData[q].files.push({ type, file: this.tmpFile[0] });
    (document.getElementById('inp_select_mv') as HTMLInputElement).value = "0";
    (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
  }
  selectFile(event: any) {
    const target = event.target;

    if (target.files.length == 0) {
      (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
    }
    if (target.files[0].size / 1000 > 1000) {
      Swal.fire({
        icon: 'info',
        text: 'Archivo excede el tamaño permitido (1Mb).'
      });
      (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
      return;
    }
    const tmp = target.files[0].type.split('/')[0];
    if (tmp != 'image' && target.files[0].type != 'application/pdf') {
      Swal.fire({
        icon: 'info',
        text: 'Tipo de archivo no permitido.'
      });
      (document.getElementById('inp_file_0') as HTMLInputElement).value = "";
      return;
    }
    this.tmpFile = event.target.files;
  }
  deleteFile(file:any){
    const i = this.newData.findIndex(r=>r.residue == this.tableSelected && r.row == this.rowSelected);
    if(i>-1) {
      if(this.newData[i].files) {
        const j = (this.newData[i].files as any[]).findIndex(f => f.type == file.type && f.file.name == file.file.name);
        if(j==-1) alert("aa");
        (this.newData[i].files as any[]).splice(j,1);
      }
    }
  }
}
