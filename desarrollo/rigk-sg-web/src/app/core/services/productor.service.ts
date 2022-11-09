import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductorService {

  url = `${environment.API_V1_URL}/statement`;

  constructor(private http: HttpClient) { }

  saveForm(data: any) {
    return this.http.post(`${this.url}`, data);
  }
  
  getValueStatementByYear(id_business:any, year:number) {
    return this.http.get<any>(`${this.url}/${id_business}/year/${year}`);
  }

}
