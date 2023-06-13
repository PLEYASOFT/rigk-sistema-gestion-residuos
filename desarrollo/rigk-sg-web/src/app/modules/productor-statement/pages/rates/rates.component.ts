import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(public ratesService: RatesTsService, private router: Router) { }

  ngOnInit(): void {
    this.ratesService.getRates(this.year).subscribe({
      next:resp => {
        if (resp.status) {
          if(resp.data.length < 4) {
            Swal.fire({
              icon: 'info',
              text: `Las tarifas del año ${this.year} no han sido ingresadas. Por favor contacte al administrador`
            }).then(btn=>{
              if (btn.isConfirmed) {
                this.router.navigate(['/productor/home']);
              }
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
        this.router.navigate(['/productor/home']);
      }
    }
    );
  }
}
