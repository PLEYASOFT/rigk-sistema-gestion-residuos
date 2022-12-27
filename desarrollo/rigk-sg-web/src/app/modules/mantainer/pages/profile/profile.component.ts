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
  userData: any | null;
  pos = "right";
  horaIngreso = new Date();

  formData: FormGroup = this.fb.group({
    actual: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    repeatPassword: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.horaIngreso = new Date(sessionStorage.getItem('horaIngreso')!);
  }

  btnrecovery() {
    const { actual, password, repeatPassword } = this.formData.value;
    this.authService.modifyPassword(password, repeatPassword, actual).subscribe({
      next: resp => {
        if (resp.status) {
          Swal.fire({
            title: "Cambio de contraseña",
            text: "La contraseña fue cambiada exitosamente",
            icon: "success",
          })
          this.router.navigate(['/mantenedor/home']);
        }
        else {
          Swal.fire({
            title: "Validar información",
            text: resp.msg,
            icon: "error",
          });
          this.formData.reset();
        }
      },
    error: err => {
      Swal.fire({
        title: 'Formato inválido',
        text: 'Contraseña debe contener al menos 8 caracteres',
        icon: 'error'
      })
    }
    });
  }

  displayModifyPassword() {
    if (this.pos == "right") {
      this.pos = "down";
    } else {
      this.pos = "right";
    }
  }

}
