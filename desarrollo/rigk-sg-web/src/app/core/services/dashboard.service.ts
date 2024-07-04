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

  getAllLinearDashboard(year:any) {
    return this.http.get<any>(`${this.url}/getAllLinearDashboard/${year}`);
  }

  getLinearDashboard(year:any, business:any) {
    return this.http.get<any>(`${this.url}/getLinearDashboard/${year}/${business}`);
  }

  getLinearDashboardArray(year:any, business:any) {
    return this.http.get<any>(`${this.url}/getLinearDashboardArray/${year}/${business}`);
  }
  
  getAllBarChartData(year:any) {
    return this.http.get<any>(`${this.url}/getAllBarChartData/${year}`);
  }

  getBarChartDataByCompanyId(year:any, business:any) {
    return this.http.get<any>(`${this.url}/getBarChartDataByCompanyId/${year}/${business}`);
  }

  getBarChartDataByCompanyIdArray(year:any, business:any) {
    return this.http.get<any>(`${this.url}/getBarChartDataByCompanyIdArray/${year}/${business}`);
  }

  getAllStackedBarChartData(year:any) {
    return this.http.get<any>(`${this.url}/getAllStackedBarChartData/${year}`);
  }

  getStackedBarChartDataByCompanyId(year:any,business:any) {
    return this.http.get<any>(`${this.url}/getStackedBarChartDataByCompanyId/${year}/${business}`);
  }

  getStackedBarChartDataByCompanyIdArray(year:any,business:any) {
    return this.http.get<any>(`${this.url}/getStackedBarChartDataByCompanyIdArray/${year}/${business}`);
  }
  
}
