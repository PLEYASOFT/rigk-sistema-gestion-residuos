import { Component} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent{

  formData: FormGroup = this.fb.group({
    user: [ '', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    repeatPassword: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  btnrecovery() {

    console.log("aaa")
    
    console.log(this.formData.value);

    const {user, password, repeatPassword} = this.formData.value;

    this.authService.recovery(user, password, repeatPassword).subscribe(resp => {
      console.log(resp);
      this.router.navigate(['/auth/login']);
    });
  }
}
