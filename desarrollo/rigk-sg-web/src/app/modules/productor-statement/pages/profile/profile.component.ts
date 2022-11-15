import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  formData: FormGroup = this.fb.group({
    actual: [ '', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    repeatPassword: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  btnrecovery() {

    const {actual, password, repeatPassword} = this.formData.value;
    console.log(this.formData.value)
    this.authService.modifyPassword(password, repeatPassword, actual).subscribe(resp => {
    if (resp.status){
      Swal.fire({
        title:"Cambio de contraseña",
        text:"La contraseña fue cambiada exitosamente",
        icon:"success",
      })
      this.router.navigate(['/auth/login']);
    }
    });
  }

  ngOnInit(): void {
  }
  pos="right";
  
  displayModifyPassword() {
    if(this.pos == "right") {
      this.pos = "down";
    } else {
      this.pos = "right";
    }
  }

}
