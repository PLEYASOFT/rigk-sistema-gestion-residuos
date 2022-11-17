import { Component, OnInit } from '@angular/core';
import { ProductorService } from '../../../../core/services/productor.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  
  error = false;
  msg = '';

  formData: FormGroup = this.fb.group({
    user: [ '', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private actived: ActivatedRoute) {
                this.actived.queryParams.subscribe(r=>{
                  if(r['logout']) {
                    sessionStorage.clear();
                  }
                })
              }
  ngOnInit(): void {
    if(sessionStorage.getItem('token')) {
      this.router.navigate(['/productor']);
      // sessionStorage.clear();
    }
  }

  btnLogin() {
    const {user, password} = this.formData.value;

    this.authService.login(user, password).subscribe(resp => {

      console.log(resp.status)
      if (resp.status == 200)
      {
        if(!resp.body.status) {
          this.error = true;
          this.msg = resp.body.msg;
        }
        else{
          sessionStorage.setItem('user', JSON.stringify( resp.body.data.user));
          this.router.navigate(['/productor']);
        }
      }
      else if(!resp.status) {
        this.error = true;
        this.msg = resp.msg;
      } else {

        sessionStorage.setItem('user', JSON.stringify( resp.body.data.user));
        this.router.navigate(['/productor']);
      }
    });
  }

}
