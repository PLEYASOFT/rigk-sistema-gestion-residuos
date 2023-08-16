import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MaintainerRatesService {
  private url = `${environment.API_V1_URL}/algo`;

  constructor(private http: HttpClient) { }

  getMaintainerRates() {
    return this.http.get<any>(`${this.url}/#`);
  }
}
