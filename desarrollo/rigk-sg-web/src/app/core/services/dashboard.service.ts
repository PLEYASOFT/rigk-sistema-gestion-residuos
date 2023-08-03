import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url = `${environment.API_V1_URL}/dashboard`;

  constructor(private http: HttpClient) { }

  getDashboard() {
    return this.http.get<any>(`${this.url}/get`);
  }
}
