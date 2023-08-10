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

  getSemesterDashboard() {
    return this.http.get<any>(`${this.url}/getSemester`);
  }

  getYearlyMaterialWeights() {
    return this.http.get<any>(`${this.url}/getMatYears`);
  }

  getAllTonByYear(year:any) {
    return this.http.get<any>(`${this.url}/getPOM/${year}`);
  }

  getCountBusiness() {
    return this.http.get<any>(`${this.url}/getBusiness`);
  }
}
