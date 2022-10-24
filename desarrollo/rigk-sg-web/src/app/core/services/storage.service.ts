import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  getSessionDataUser(): any {
    const sesionData = sessionStorage.getItem('user');
    return sesionData != null ? JSON.parse(sesionData) : false;
  }
}
