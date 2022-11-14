import { Component} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../core/services/modifyPassword.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery',//no se que es esto
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.css']
})
export class ModifyComponent{

  formData: FormGroup = this.fb.group({
    //user: [ '', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
    repeatPassword: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  btnrecovery() {

    console.log("btn modificarrrrrrr")
    
    console.log(this.formData.value);

    const {user, password, repeatPassword} = this.formData.value;

    this.authService.recovery(user, password, repeatPassword).subscribe(resp => {
      console.log(resp);
      this.router.navigate(['/auth/login']);
    });
  }
}
