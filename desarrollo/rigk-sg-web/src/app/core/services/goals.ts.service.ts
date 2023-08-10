import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoalsTsService {
  url = `${environment.API_V1_URL}/goals`;

  constructor(private http: HttpClient) { }
  getAllGoals(){
    return this.http.get<any>(`${this.url}/goals/`);
  }

  updateRates(id: any, price:any) {
    return this.http.put<any>(`${this.url}/updateRates/${id}`, {price});
  }
  updateRatesByYear(value:any) {
    return this.http.put<any>(`${this.url}/updateRatesYear`, value);
  }
  save(value:any) {
    return this.http.post<any>(`${this.url}/`, value);
  }
  updateBusiness(id: any,name:any, vat:any, loc_address:any, phone:any, email:any,am_first_name:any,am_last_name:any,invoice_name:any,invoice_email:any,invoice_phone:any, code_business:any, giro:any) {
    return this.http.put<any>(`${this.url}/business/${id}`, {name, vat, loc_address, phone, email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business, giro});
  }
}
