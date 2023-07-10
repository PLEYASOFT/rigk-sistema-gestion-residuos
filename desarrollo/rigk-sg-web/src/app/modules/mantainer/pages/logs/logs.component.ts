import { Component, OnInit } from '@angular/core';
import { LogsService } from 'src/app/core/services/logs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  constructor(
    public ls: LogsService
  ) { }

  ngOnInit(): void {
  }

  generarExcel() {
    const ds = (document.getElementById('ds') as HTMLInputElement).value;
    const de = (document.getElementById('de') as HTMLInputElement).value;
    if(ds == '') {
      Swal.fire({
        icon:'error',
        text: 'Debe ingresar fecha de inicio'
      });
      return;
    }
    if(de == '') {
      Swal.fire({
        icon:'error',
        text: 'Debe ingresar fecha de término'
      });
      return;
    }
    const tmp1 = new Date(ds);
    const tmp2 = new Date(de);
    if(tmp1>tmp2) {
      Swal.fire({
        icon:'error',
        text: 'Fecha de inicio debe ser menor a la fecha de término'
      });
      return;
    }
    
    Swal.fire({
      icon: 'info',
      text: 'Generando Excel',
      timerProgressBar: true,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.ls.downloadExcel(ds, de).subscribe(r => {
      Swal.close();
      if (r) {
        const file = new Blob([r], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(file);
        link.download = `logs_prorep`;
        document.body.appendChild(link);
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        link.remove();
        window.URL.revokeObjectURL(link.href);
        (document.getElementById('ds') as HTMLInputElement).value ='';
        (document.getElementById('de') as HTMLInputElement).value ='';
      }
    });
  }

  validaBtn() {
    const ds = (document.getElementById('ds') as HTMLInputElement).value;
    const de = (document.getElementById('de') as HTMLInputElement).value;
    if (ds == '' || de == '') {
      return true;
    }

    return false;
  }

}
