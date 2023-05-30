import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Sistema Gestion Rigk';
  inactiveSeconds: any = 0;
  timer: any;
  active: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url === '/auth/login' || event.url === '/auth/login?logout=true' || event.url === '/auth/sendCode') {
          clearTimeout(this.timer);
          this.inactiveSeconds = 0;
          this.resetTimer();
        } else {
          clearTimeout(this.timer);
          this.inactiveSeconds = 0;
          this.startTimer();
        }
      }
    });

    document.addEventListener('click', () => {
      clearTimeout(this.timer);
      this.inactiveSeconds = 0;
      this.startTimer();
    });

    document.addEventListener('keypress', () => {
      clearTimeout(this.timer);
      this.inactiveSeconds = 0;
      this.startTimer();
    });
  }

  startTimer() {
    if (!this.active) return;
    this.timer = setTimeout(() => {
      this.inactiveSeconds++;
      // if (this.inactiveSeconds >= 1800) { //30 minutos
      if (this.inactiveSeconds >= 10) {
        this.router.navigate(['/auth/login'], { queryParams: { logout: true } });
        Swal.fire({
          icon: 'error',
          text: 'Haz superado el tiempo de inactividad'
        })
        return;
      } else {
        this.startTimer();
      }
    }, 1000);
  }

  stopTimer() {
    this.active = false;
    this.inactiveSeconds = 0;
  }

  resetTimer() {
    this.stopTimer();
    this.active = true;
    this.startTimer();
  }
}
