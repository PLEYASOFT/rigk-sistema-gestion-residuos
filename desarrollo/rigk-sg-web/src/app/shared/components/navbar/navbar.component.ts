import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userData: any | null;
  isVisible = true;
  horaIngreso = new Date();
  
  @Output() isVisibleBar: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router,
              public auth: AuthService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
    this.horaIngreso = new Date(sessionStorage.getItem('horaIngreso')!);
  }

  logout() {
    this.auth.logout.subscribe({
      next: r=> {
        if(r.status) {
          this.router.navigate(['/auth/login'], { queryParams: { logout: true } });
        }
      }
    })
  }
  toggleMenu() {
    this.isVisible = !this.isVisible;
    this.isVisibleBar.emit(this.isVisible);
  }
  toggleMenuMobile() {
    document.getElementById('sidebar')?.classList.toggle("active");
  }
  toggleProfileMenu() {
    document.getElementById('info-profile')?.classList.toggle("show");
  }

}
