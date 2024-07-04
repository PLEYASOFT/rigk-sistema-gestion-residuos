import { Component, OnInit } from '@angular/core';
import { RatesTsService } from 'src/app/core/services/rates.ts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  types = ['EyE reciclables de papel/cartón', 'EyE reciclables de metal', 'EyE reciclables de plásticos', 'EyE no reciclables'];
  year = new Date().getFullYear();
  rates: any[] = []
  constructor(public ratesService: RatesTsService) { }

  ngOnInit(): void {
    this.ratesService.getRates(this.year).subscribe(resp => {
      if (resp.status) {
        resp.data.forEach((lalala: any) => {
          const name = this.types[lalala.type - 1];
          const price = lalala.price; //*precio_uf
          this.rates.push({ name, price });
        });
      }
    })
    localStorage.removeItem('statementsState');
  }

}
