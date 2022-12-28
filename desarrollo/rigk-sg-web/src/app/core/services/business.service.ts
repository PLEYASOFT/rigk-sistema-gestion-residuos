import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  url = `${environment.API_V1_URL}/business`;

  constructor(private http: HttpClient) { }

  verifyBusiness(id: number) {
    return this.http.get<any>(`${this.url}/verify/${id}`);
  }

  getBusiness(id: string) {
    return this.http.get<any>(`${this.url}/business/${id}`);
  }

  getAllBusiness(){
    return this.http.get<any>(`${this.url}/business/`);
  }
}
