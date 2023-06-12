import { Component, OnInit } from '@angular/core';
import { RatesTsService } from 'src/app/core/services/rates.ts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {
  types = ['EyE reciclables de papel/cartón', 'EyE reciclables de metal', 'EyE reciclables de plásticos', 'EyE no reciclables'];
  typex = ['Papel/cartón', 'Metal', 'Plástico', 'No Reciclable'];
  year = new Date().getFullYear();
  rates: any[] = []
  constructor(public ratesService: RatesTsService) { }

  ngOnInit(): void {
    this.ratesService.getRates(this.year).subscribe({
      next:resp => {
        if (resp.status) {
          console.log(resp.data);
          if(resp.data.length < 4) {
            Swal.fire({
              icon: 'info',
              text: `Tarifa año ${this.year} no ha sido ingresada. Contacte al administrador`
            });
          }
          resp.data.forEach((lalala: any) => {
            const name = this.types[lalala.type - 1];
            const price = lalala.price;
            this.rates.push({ name, price });
          });
        }
      },
      error: r=> {
        Swal.fire({
          icon: 'error',
          text: `Algo salió mal`
        });
        return;
      }
    }
    )
  }
}
