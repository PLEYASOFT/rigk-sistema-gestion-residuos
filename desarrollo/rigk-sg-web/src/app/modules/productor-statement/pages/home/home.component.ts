import { Component, OnInit } from '@angular/core';
import { RatesTsService } from '../../../../core/services/rates.ts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  //const year = new Date().year() +1
  types=['EyE reciclables cartón', 'EyE Reciclable de metal', 'EyE de plástico', 'EyE no reciclables', 'EyE Reutilizables', 'EyE de madera']
  rates:any[]=[]
  constructor(public ratesService:RatesTsService) { }
  
  ngOnInit(): void {
    const year = new Date().getFullYear();
    this.ratesService.getRates(year).subscribe(resp =>{
      console.log(resp.data)
      if (resp.status){
        
      }
      resp.data.forEach((lalala: any) => {
        const name = this.types[lalala.type-1];
        const price = lalala.price ; //*precio_uf
        this.rates.push({name, price});
      })
      console.log(this.rates)
    })
  }
  getValueRates(): void {

  }

}
