import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RatesTsService {
  url = `${environment.API_V1_URL}/rates`;

  constructor(private http: HttpClient) { }
  getRates(year: number) {
    return this.http.get<any>(`${this.url}/${year}`);
  }
  get getCLP() {
    return this.http.get<any>(`${this.url}/clp`);
  }
}
