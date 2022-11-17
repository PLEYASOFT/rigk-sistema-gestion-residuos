import { Component} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-send-code',
  templateUrl: './send-code.component.html',
  styleUrls: ['./send-code.component.css']
})
export class SendCodeComponent{

  step = 0;
  msg = '';
  
  formData: FormGroup = this.fb.group({
    user: [ '', [Validators.required, Validators.email]],
    code: [ '', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    repeatPassword: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  btnSendCode() {
    
    console.log(this.formData.value);

    

    console.log(this.step)
    if(this.step == 0){
      const {user} = this.formData.value;
      //Mandar código
      this.authService.sendCode(user).subscribe(resp => {
      console.log(resp, resp.status);
      if(resp.status){
        
        this.step++;
      }

      else{
        Swal.fire({
          title: 'Correo no es  correcto, intente nuevamente',
          icon: 'error'
        })
      }
      });
    }

    if(this.step == 1){
      const {user,code} = this.formData.value;
      //Pedir código
      this.authService.verifyCode(code, user).subscribe(resp => {
      console.log(resp);
      
      if(resp.status){
        this.step++;
      }

      else{
        this.msg = resp.msg;
        Swal.fire({
          title: this.msg,
          icon: 'error'
        })
      }
      });
    }

    if(this.step == 2){
      const {user, password, repeatPassword} = this.formData.value;
      //Recuperar contraseña
      this.authService.recovery(user, password, repeatPassword).subscribe(resp => {
      console.log(resp);
      if(resp.status){
        Swal.fire({
          title: 'Contraseña modificada exitosamente',
          icon: 'success'
        })

        this.router.navigate(['/auth/login']);
      }
      
      else{
        this.msg = resp.msg;
        Swal.fire({
          title: this.msg,
          icon: 'error'
        })
      }
      });
    }
   
  }
}
