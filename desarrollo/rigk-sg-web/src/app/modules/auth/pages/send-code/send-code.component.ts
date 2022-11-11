import { Component} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-code',
  templateUrl: './send-code.component.html',
  styleUrls: ['./send-code.component.css']
})
export class SendCodeComponent{

  formData: FormGroup = this.fb.group({
    user: [ '', [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  btnSendCode() {
    
    console.log(this.formData.value);

    const {user} = this.formData.value;

    this.authService.sendCode(user).subscribe(resp => {
      console.log(resp);
      this.router.navigate(['/auth/verifycode']);
    });
  }
}
