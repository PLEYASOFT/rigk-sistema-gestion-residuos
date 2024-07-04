import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  url = `${environment.API_V1_URL}/logs`;

  constructor(private http: HttpClient) { }

  get createLog() {
    return this.http.get<any>(`${this.url}/`);
  }
  errorLog(error:string) {
    return this.http.post<any>(`${this.url}/error`, {error});
  }
  downloadExcel(start: any, end: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.ms-excel');
    return this.http.post<any>(`${this.url}/`, {start, end},{ headers: headers, responseType: 'blob' as 'json' });
  }
}
