
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
  rol: any = '';
  multiRol: boolean = false;
  userRoles: any[] = [];

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
    });
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
          if (resp.body.data.user.ROLES.length == 1) {
            const rol = resp.body.data.user.ROLES[0];
            const userObj = JSON.parse(sessionStorage.getItem('user')!);
            userObj.ROL = rol;
            sessionStorage.setItem('user', JSON.stringify(userObj));
            if(rol == 9){
              this.router.navigate(['/productor']);
            }
            else if(rol == 10){
              this.router.navigate(['/mantenedor']);
            }
            else if(rol == 11){
              this.router.navigate(['/consumidor']);
            }
            else if(rol == 12){
              this.router.navigate(['/gestor']);
            }
          }else{
            this.multiRol = true;
            this.userRoles = resp.body.data.user.ROLES;
          }
        }
      },
      error: err => {
        this.error = true;
        this.msg = err.msg;
      }
    });
  }

  selectRoleAndLogin() {
    if (this.rol) {
      this.navigateToRole(this.rol);
      this.multiRol = false;
    } else {
      alert("Por favor, seleccione un rol.");
    }
  }

  navigateToRole(rol: string) {
    if (rol === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (rol === 'Gestor') {
      this.router.navigate(['/gestor']);
    } else if (rol === 'Consumidor') {
      this.router.navigate(['/consumidor']);
    } else if (rol === 'Productor') {
      this.router.navigate(['/productor']);
    }
  }
}
