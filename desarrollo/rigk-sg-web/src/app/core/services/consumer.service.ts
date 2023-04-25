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
    for (let i = 0; i < data.detail.length; i++) {
      const f = data.detail[i];
      if (f.files) {
        for (let j = 0; j < f.files.length; j++) {
          const file = f.files[j];
          body.append(`f_${f.sub}_${f.treatment}_${file.type}`, file.file);
        }
      }
    }
    body.append("header", JSON.stringify(data.header));
    body.append("detail", JSON.stringify(data.detail));
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
    return this.http.get<any>(`${this.url}/excel/${id_business}`, { headers: headers, responseType: 'blob' as 'json' });
  }

}
