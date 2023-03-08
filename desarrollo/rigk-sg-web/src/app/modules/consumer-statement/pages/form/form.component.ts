import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentService } from '../../../../core/services/establishment.service';
import { ConsumerService } from '../../../../core/services/consumer.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  materials = [
    {
      name: "Papel/Cartón",
    },
    { id: 1, name: "Papel" },
    { id: 2, name: "Papel Compuesto (cemento)" },
    { id: 3, name: "Caja Cartón" },
    { id: 4, name: "Otro" },
    {
      name: "Metal",
    },
    { id: 5, name: "Envase Aluminio" },
    { id: 6, name: "Malla o Reja (IBC)" },
    { id: 7, name: "Envase Hojalata" },
    { id: 8, name: "Otro" },
    {
      name: "Plástico Total",
    },
    { id: 9, name: "Plástico Film Embalaje" },
    { id: 10, name: "Plástico Envases Rígidos (Incl. Tapas)" },
    { id: 11, name: "Plástico Sacos o Maxisacos" },
    { id: 12, name: "Plástico EPS (Poliestireno Expandido)" },
    { id: 13, name: "Plástico Zuncho" },
    { id: 14, name: "Otro" },
    {
      name: "Madera",
    },
    { id: 15, name: "Caja de Madera" },
    { id: 16, name: "Pallet de Madera" }
  ];
  disableAll = false;
  tables = [
    "Reciclaje Mecánico",
    "Valorización Energética",
    "Disposición Final en RS"
  ];
  total_tables = [0, 0, 0];
  id_establishment = -1;
  establishments: any[] = [];
  selectedEstablishment: any = [];
  attached: any[] = [];
  id_business = "0";
  year_statement = 0;
  establishment = "";
  goTo = '/consumidor/';
  data: { table: number, residue: number, val: number, date_withdraw: string, id_gestor: number }[] = [];
  constructor(public establishmentService: EstablishmentService,
    public consumerService: ConsumerService,
    private router: Router,
    private actived: ActivatedRoute,) {
    this.actived.data.subscribe((r: any) => {
      if (r.show) {
        const id = this.actived.snapshot.params['id'];
        this.loadForm(id);
        this.disableAll = true;
      } else {
        this.actived.queryParams.subscribe(r => {
          this.id_business = r['id_business'];
          this.year_statement = r['year'];
          this.loadEstablishments();
        });
      }
    });
  }
  ngOnInit(): void {
  }
  loadForm(id: any) {
    Swal.fire({
      title: 'Cargando Datos',
      text: 'Se está recuperando datos',
      timerProgressBar: true,
      showConfirmButton: false
    });
    Swal.showLoading();
    this.goTo = '/consumidor/statements';
    this.consumerService.getForm(id).subscribe({
      next: r => {
        const { header, detail, attached } = r.data;
        this.id_business = header.ID_BUSINESS;
        this.establishment = header.NAME_ESTABLISHMENT;
        this.attached = attached;
        for (let o = 0; o < detail.length; o++) {
          const l = detail[o];
          (document.getElementById(`inp_1_${l.PRECEDENCE}_${l.TYPE_RESIDUE}`) as HTMLInputElement).value = (l.VALUE.toString().replace(".", ","));
          (document.getElementById(`inp_2_${l.PRECEDENCE}_${l.TYPE_RESIDUE}`) as HTMLInputElement).value = l.DATE_WITHDRAW.split("T")[0];
          (document.getElementById(`inp_3_${l.PRECEDENCE}_${l.TYPE_RESIDUE}`) as HTMLSelectElement).value = l.ID_GESTOR;
          this.total_tables[l.PRECEDENCE] += l.VALUE;
        }
        let tmp = 3;
        for (let i = 0; i < attached.length; i++) {
          const f = attached[i];
          for (let j = 0; j < tmp; j++) {
            const pos = j;
            if ((document.getElementById(`inp_f_${pos + 1}_${f.PRECEDENCE}_${f.TYPE_RESIDUE}`) as HTMLSelectElement).value != "0") {
              continue;
            } else {
              (document.getElementById(`inp_f_${pos + 1}_${f.PRECEDENCE}_${f.TYPE_RESIDUE}`) as HTMLSelectElement)!.value = f.TYPE_FILE;
              (document.getElementById(`pdf_${pos + 1}_${f.PRECEDENCE}_${f.TYPE_RESIDUE}`) as HTMLButtonElement)!.classList.remove('d-none');
              break;
            }
          }
        }
        Swal.close();
      }
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
  updateVal(table: number, residue: number, target: any) {
    if ((target.value as string).indexOf(".") != -1) {
      target.value = 0;
      return;
    }
    const pattern = /^[0-9]+(,[0-9]+)?$/;
    if (!pattern.test(target.value)) {
      target.value = 0;
    }
    let value = parseFloat(target.value.replace(",", "."));
    if (!target.value || isNaN(value) || value < 0) {
      value = 0;
      target.value = 0;
    }
    const reg = this.data.find(r => r?.residue == residue && r?.table == table);
    if (reg) {
      reg.val = value;
    } else {
      this.data.push({ table, residue, val: value, date_withdraw: "", id_gestor: 0 });
    }
    this.total_tables[table] = 0;
    for (let i = 0; i < this.data.length; i++) {
      const e = this.data[i];
      if (e.table == table) this.total_tables[table] += e.val;
    }
  }
  updateGestor(table: number, residue: number, target: any) {
    const reg = this.data.find(r => r?.residue == residue && r?.table == table);
    if (reg) {
      reg.id_gestor = target.value;
    } else {
      this.data.push({ table, residue, id_gestor: target.value, date_withdraw: "", val: 0 });
    }
  }
  updateDate(table: number, residue: number, target: any) {
    const reg = this.data.find(r => r?.residue == residue && r?.table == table);
    if (reg) {
      reg.date_withdraw = target.value;
    } else {
      this.data.push({ table, residue, date_withdraw: target.value, id_gestor: 0, val: 0 });
    }
  }
  uploadFile(table: number, residue: number, target: any, col: number) {
    if (target.files.length == 0) {
      document.getElementById(`btn_f_${col}_${table}_${residue}`)?.classList.add('d-none');
      (document.getElementById(`f_${col}_${table}_${residue}`) as HTMLInputElement).value = '';
    }
    if (target.files[0].size / 1000 > 1000) {
      Swal.fire({
        icon: 'info',
        text: 'Archivo excede el tamaño permitido (1Mb).'
      });
      document.getElementById(`btn_f_${col}_${table}_${residue}`)?.classList.add('d-none');
      (document.getElementById(`f_${col}_${table}_${residue}`) as HTMLInputElement).value = '';
      return;
    }
    // const tmp = target.files[0].type.split('/')[0];
    // if(tmp != 'image' && target.files[0].type != 'application/pdf') {
    //   Swal.fire({
    //     icon: 'info',
    //     text: 'Tipo de archivo no permitido.'
    //   });
    // document.getElementById(`btn_f_${col}_${table}_${residue}`)?.classList.add('d-none');
    // (document.getElementById(`f_${col}_${table}_${residue}`) as HTMLInputElement).value = '';
    //   return;
    // }
    const i = this.attached.findIndex(r => r.col == col && r.table == table && r.residue == residue);
    if (i == -1) {
      this.attached.push({ table, residue, col, type: (this.attached[i]?.type || 0), file: target.files[0] });
    } else {
      this.attached[i].file = target.files[0];
    }
    document.getElementById(`btn_f_${col}_${table}_${residue}`)?.classList.remove('d-none');
  }
  updateType(table: number, residue: number, target: any, col: number) {
    const i = this.attached.findIndex(r => r.col == col && r.table == table && r.residue == residue);
    if (i == -1) {
      this.attached.push({ table, residue, col, file: null, type: target.value });
    } else {
      this.attached[i].type = target.value;
    }
  }
  saveForm() {
    if (this.data.length == 0) {
      Swal.fire({
        icon: 'error',
        text: 'Formulario está vacío'
      })
      return;
    }
    // Verify data
    let error = null;
    if (!this.selectedEstablishment[0] || this.selectedEstablishment[0] == 0) {
      error = 'Falta establecimiento';
    }
    for (let i = 0; i < this.data.length; i++) {
      const reg = this.data[i];
      if ((reg.val == 0 && (reg.date_withdraw != "" || reg.id_gestor > 0))) {
        error = "Falta ingresar peso";
        break;
      } else if (reg.val > 0 && (reg.date_withdraw == "" || reg.id_gestor == 0)) {
        error = "Falta ingresar fecha de retiro o gestor";
        break;
      } else if (reg.val == 0 && (reg.date_withdraw == "" || reg.id_gestor == 0)) {
        this.data.splice(i, 1);
        if (this.data.length == 0) {
          error = "Formulario está vacío";
        }
        break;
      }
    }
    if (error) {
      Swal.fire({
        icon: 'error',
        text: error
      });
      return;
    }
    for (let i = 0; i < this.attached.length; i++) {
      const f = this.attached[i];
      if ((f.type == 0 && f.file != null) || (f.type > 0 && f.file == null)) error = "Falta seleccionar tipo de M.V o archivo";
    }
    if (error) {
      Swal.fire({
        icon: 'error',
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
    const detail = { data: this.data, attached: this.attached };
    this.consumerService.save({ header, detail, attached: this.attached }).subscribe({
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
  downloadFile(table: number, residue: number, col: number) {
    const i = this.attached.filter(r => r.PRECEDENCE == table && r.TYPE_RESIDUE == residue);
    if (i.length > 0) {
      const f = i[col - 1];
      var blob = new Blob([new Uint8Array(f.FILE.data)], { type: "Buffer" });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      var fileName = f.FILE_NAME;
      link.download = fileName;
      link.click();
    }
  }
  deleteSelectedFile(table: number, residue: number, col: number) {
    const i = this.attached.findIndex(r => r.col == col && r.table == table && r.residue == residue);
    if (i > -1) {
      this.attached.splice(i, 1);
    }
    document.getElementById(`btn_f_${col}_${table}_${residue}`)?.classList.add('d-none');
    (document.getElementById(`inp_f_${col}_${table}_${residue}`) as HTMLSelectElement).value = "0";
    (document.getElementById(`f_${col}_${table}_${residue}`) as HTMLInputElement).value = '';
  }
  goBack() {
    this.router.navigate([this.goTo]);
  }
}
