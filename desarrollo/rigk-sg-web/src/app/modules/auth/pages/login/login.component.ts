import { Component, OnInit } from '@angular/core';
import { ProductorService } from '../../../../core/services/productor.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authSerice: ProductorService) { }

  ngOnInit(): void {
  }

  btnLogin() {
    const usuario = "lalla";
    const contrasenia = "bbb";


    this.authSerice.login(usuario, contrasenia).subscribe(r=>{
      if(r.status) {
        // ... ok logeado
      } else {
        // no login
      }
    });
  }

}
