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

  _files: any[] = [];

  constructor(public establishmentService: EstablishmentService,
    public consumerService: ConsumerService,
    private router: Router,
    private actived: ActivatedRoute,) {

    this.actived.data.subscribe((r:any)=>{
      if(r.show) {
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
    this.consumerService.getForm(id).subscribe({
      next: r=> {
        const {header, detail, attached} = r.data;
        this.id_business = header.ID_BUSINESS;
        this.establishment = header.NAME_ESTABLISHMENT;
        console.log(attached);
        for (let o = 0; o < detail.length; o++) {
          const l = detail[o];
          console.log(l);
          (document.getElementById(`inp_1_${l.PRECEDENCE}_${l.TYPE_RESIDUE}`) as HTMLInputElement).value=(l.VALUE.toString().replace(".",","));
          (document.getElementById(`inp_2_${l.PRECEDENCE}_${l.TYPE_RESIDUE}`) as HTMLInputElement).value=l.DATE_WITHDRAW.split("T")[0];
          (document.getElementById(`inp_3_${l.PRECEDENCE}_${l.TYPE_RESIDUE}`) as HTMLSelectElement).value=l.ID_GESTOR;
          this.total_tables[l.PRECEDENCE] += l.VALUE;
        }
        let tmp = 0;
        for (let i = 0; i < attached.length; i++) {
          const f = attached[i];
          if(tmp<3) {
            console.log(`ino_f_${tmp+1}_${f.PRECEDENCE}_${f.TYPE_RESIDUE}`);
            (document.getElementById(`inp_f_${tmp+1}_${f.PRECEDENCE}_${f.TYPE_RESIDUE}`) as HTMLSelectElement).value=f.TYPE_FILE;
            tmp++;
            this._files.push(f);
          }
        }
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

  data: { table: number, residue: number, val: number, date_withdraw: string, id_gestor: number }[] = [];

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
    this.data.forEach(e => {
      this.total_tables[table] += e.val;
    });
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
    const i = this.attached.findIndex(r => r.col == col && r.table == table && r.residue == residue);
    if (i == -1) {
      this.attached.push({ table, residue, col, type: (this.attached[i]?.type || 0), file: target.files[0] });
    } else {
      this.attached[i].file = target.files[0];
    }
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
    if (this.data.length == 0) return;

    // Verify data
    let error = null;
    if (!this.selectedEstablishment[0] || this.selectedEstablishment[0] == 0) {
      error = true
    }

    for (let i = 0; i < this.data.length; i++) {
      const reg = this.data[i];
      if ((reg.val == 0 && (reg.date_withdraw != "" || reg.id_gestor > 0)) || (reg.val > 0 && (reg.date_withdraw == "" || reg.id_gestor == 0))) error = 1;
    }

    for (let i = 0; i < this.attached.length; i++) {
      const f = this.attached[i];
      if ((f.type == 0 && f.file != null) || (f.type > 0 && f.file == null)) error = 2;
    }

    if (error) {
      Swal.fire({
        icon: 'error',
        text: error == 1 ? 'Datos incompletos' : 'Medios de verificación incompletos'
      });
      return
    }

    const header = { year: this.year_statement, establishment: this.selectedEstablishment[0] };
    const detail = { data: this.data, attached: this.attached };
    this.consumerService.save({ header, detail, attached: this.attached }).subscribe({
      next: r => {
        if (r.status) {
          Swal.fire({
            icon: 'success',
            text: 'Declaración guardada satisfactoriamente'
          });
          this.router.navigate(['/consumidor']);
        }
      }
    });

  }

  blobToFile(data: any, type: string, fileName: string) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    a.href = url; a.download = fileName; a.click();
    window.URL.revokeObjectURL(url);
  }

  downloadFile(col:number) {
    if(this._files[col-1]){
      const f = this._files[col-1];
      console.log(this._files[col-1]);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      const blob = new Blob([f.FILE], {type: 'application/pdf'});
      const url = window.URL.createObjectURL(blob);
      a.href = url; a.download = f.FILE_NAME; a.click();
      window.URL.revokeObjectURL(url);

      // let downloadLink = document.createElement('a');
      //     downloadLink.href = window.URL.createObjectURL(new Blob(f.FILE.data, { type: 'blob' }));
      //     downloadLink.setAttribute('download', f.FILE_NAME);
      //     document.body.appendChild(downloadLink);
      //     downloadLink.click();
    }
  }

}
