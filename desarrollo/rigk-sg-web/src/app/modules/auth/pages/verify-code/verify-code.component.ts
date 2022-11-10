import { Component} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.css']
})
export class VerifyCodeComponent{

  formData: FormGroup = this.fb.group({
    code: [ '', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    user: [ '', [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService) { }

  btnverifyCode() {
    
    console.log(this.formData.value);
    const {code, user} = this.formData.value;
    this.authService.verifyCode(code, user).subscribe(resp => {
      console.log(resp);
    });
  }
}
