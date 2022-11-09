import { Component, OnInit } from '@angular/core';
import { ProductorService } from '../../../../core/services/productor.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import router from '../../../../../../../rigk-sg-back/routes/login';
import { Router } from 'express';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  formData: FormGroup = this.fb.group({
    user: [ '', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) { }

  btnLogin() {
    
    console.log(this.formData.value);

    const {user, password} = this.formData.value;

    this.authService.login(user, password).subscribe(resp => {
      console.log(resp);
    });
  }

}
