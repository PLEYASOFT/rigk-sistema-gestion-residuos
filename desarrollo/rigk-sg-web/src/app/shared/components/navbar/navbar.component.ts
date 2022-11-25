import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userData: any | null;
  isVisible = true;
  
  @Output() isVisibleBar: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.userData = JSON.parse(sessionStorage.getItem('user')!);
  }

  logout() {
    this.router.navigate(['/auth/login'], { queryParams: { logout: true } });
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
