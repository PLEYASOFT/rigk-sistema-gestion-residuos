import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionExpirationService {
  public timerId: any = 0;

  constructor(private router: Router) {}

  startTimer() {
    this.timerId = 0;
    this.timerId = setTimeout(() => {
      this.timerId++;
      console.log(this.timerId)
    }, 1000);
  }

  stopTimer() {
    this.timerId = 0;
  }

  resetTimer() {
    this.stopTimer();
    this.startTimer();
  }
}