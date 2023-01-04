import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductorService {
  url = `${environment.API_V1_URL}/statement`;

  constructor(private http: HttpClient) { }

  saveForm(data: any) {
    return this.http.post<any>(`${this.url}`, data);
  }
  getValueStatementByYear(id_business: any, year: number, isDraft: number) {
    return this.http.get<any>(`${this.url}/${id_business}/year/${year}/isDraft/${isDraft}`);
  }
  get getStatementByUser() {
    return this.http.get<any>(`${this.url}/byUser`);
  }
  updateStateStatement(id_header: any, state: any) {
    return this.http.put<any>(`${this.url}/${id_header}/state/${state}`, {});
  }
  updateValuesStatement(id_header: any, detail: any, header: any) {
    return this.http.put<any>(`${this.url}/${id_header}`, { header, detail });
  }
  verifyDraft(id_business: any, year: any) {
    return this.http.get<any>(`${this.url}/draft/${id_business}/year/${year}`);
  }

  downloadPDF(id_business: any, year: any) {
    window.open(`${this.url}/pdf/${id_business}/year/${year}`);
  }
}
