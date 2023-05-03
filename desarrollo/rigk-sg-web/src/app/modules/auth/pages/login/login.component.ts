import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error = false;
  msg = '';
  rol:any = '';

  formData: FormGroup = this.fb.group({
    user: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private actived: ActivatedRoute) {
    this.actived.queryParams.subscribe(r => {
      if (r['logout']) {
        sessionStorage.clear();
      }
    })
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['/productor']);
    }
  }

  btnLogin() {
    const { user, password } = this.formData.value;
    this.authService.login(user,password).subscribe({
      next: resp=> {
        if (!resp.body.status) {
          this.error = true;
          this.msg = resp.body.msg;
        } else {
          const horaIngreso = new Date();
          sessionStorage.setItem('user', JSON.stringify(resp.body.data.user));
          sessionStorage.setItem('horaIngreso',horaIngreso.toString());
          this.rol = JSON.parse(sessionStorage.getItem('user')!);
          if(this.rol.ROL_NAME == 'Productor'){
            this.router.navigate(['/productor']);
          }
          else if(this.rol.ROL_NAME == 'Admin'){
            this.router.navigate(['/mantenedor']);
          }
          else if(this.rol.ROL_NAME == 'Consumidor'){
            this.router.navigate(['/consumidor']);
          }
          else if(this.rol.ROL_NAME == 'Gestor'){
            this.router.navigate(['/gestor']);
          }
        }
      },
      error: err => {
        this.error = true;
        this.msg = err.msg;
      }
    });
  }
}