import { Component, OnInit } from '@angular/core';
import { ProductorService } from '../../../../core/services/productor.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  formData: FormGroup = this.fb.group({
    user: [ '', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }
  ngOnInit(): void {
    if(sessionStorage.getItem('token')) {
      this.router.navigate(['/productor']);
      // sessionStorage.clear();
    }
  }

  btnLogin() {

    const {user, password} = this.formData.value;

    this.authService.login(user, password).subscribe(resp => {
      sessionStorage.setItem('token', resp);
      this.router.navigate(['/productor']);
    });
  }

}
