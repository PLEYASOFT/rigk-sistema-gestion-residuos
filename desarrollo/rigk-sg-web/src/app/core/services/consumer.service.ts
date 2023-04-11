import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsumerService {
  url = `${environment.API_V1_URL}/consumer`;
  constructor(private http: HttpClient) { }
  save(data: any) {
    const body = new FormData();
    for (let i = 0; i < data.attached.length; i++) {
      const f = data.attached[i];
      body.append(`f_${f.table}_${f.residue}_${f.type}`, f.file);
    }
    body.append("header", JSON.stringify(data.header));
    body.append("detail", JSON.stringify(data.detail.data));
    return this.http.post<any>(`${this.url}`, body);
  }
  getForm(id: any) {
    return this.http.get<any>(`${this.url}/${id}`);
  }
  verifyForm(business: any, year: any) {
    return this.http.get<any>(`${this.url}/verify/${year}/${business}`);
  }

  downloadExcel(id_business: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.ms-excel');
    return this.http.get<any>(`${this.url}/excel/${id_business}`,{ headers: headers, responseType: 'blob' as 'json' });
  }

}
