import { Component, OnInit } from '@angular/core';
import { RatesTsService } from 'src/app/core/services/rates.ts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

   //const year = new Date().year() +1
   types=['EyE reciclables cartón', 'EyE reciclable de metal', 'EyE de plástico', 'EyE no reciclables', 'EyE reutilizables', 'EyE de madera'];
   year = new Date().getFullYear();
   rates:any[]=[]
   constructor(public ratesService:RatesTsService) { }
   
   ngOnInit(): void {
     
     this.ratesService.getRates(this.year).subscribe(resp =>{
       resp.data.forEach((lalala: any) => {
         const name = this.types[lalala.type-1];
         const price = lalala.price ; //*precio_uf
         this.rates.push({name, price});
       })
     })
   }

}
