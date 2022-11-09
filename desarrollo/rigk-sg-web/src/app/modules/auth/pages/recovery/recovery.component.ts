import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent{

  formData: FormGroup = this.fb.group({
    user: [ '', [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder) { }

  

  

  btnRecovery() {
    
    console.log(this.formData.value);
    console.log(this.formData.valid);


    /*this.authService.login(usuario, contrasenia).subscribe((r: { status: any; })=>{
      if(r.status) {
        // ... ok logeado
      } else {
        // no login
      }
    });*/
  }


}
