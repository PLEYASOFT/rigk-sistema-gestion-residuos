import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  getTMP(year: number) {
    return this.http.get<any>(`${this.url}/year2/${year}`);
  }
  getAllStatementByYear(year: number) {
    return this.http.get<any>(`${this.url}/year/${year}`);
  }
  getDetailByIdHeader(id_header: number) {
    return this.http.get<any>(`${this.url}/detail/${id_header}`);
  }
  getProductor(id: number) {
    return this.http.get<any>(`${this.url}/${id}`);
  }
  getResumeById(id: string,year:number) {
    return this.http.get<any>(`${this.url}/resume/${id}/year/${year}`);
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
  validateStatement(id: any) {
    return this.http.put<any>(`${this.url}/validate/${id}`,{});
  }
  verifyDraft(id_business: any, year: any) {
    return this.http.get<any>(`${this.url}/draft/${id_business}/year/${year}`);
  }
  
  downloadPDF(id_business: any, year: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get<any>(`${this.url}/pdf/${id_business}/year/${year}`,{ headers: headers, responseType: 'blob' as 'json' });
  }

  uploadOC(id: any, file: any ) {
    const body = new FormData();
    body.append('file',file[0]);
    return this.http.post<any>(`${this.url}/OC/${id}`, body);
  }
  downloadPDFTerminos() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get<any>(`${environment.API_V1_URL}/utiles/download/pdf`,{ headers: headers, responseType: 'blob' as 'json' });
  }
  uploadPDFTerminos(file: any ) {
    const body = new FormData();
    body.append('file',file);
    return this.http.post<any>(`${environment.API_V1_URL}/utiles/upload/pdf`, body);
  }
  veryfyPDFTerminos() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.post<any>(`${environment.API_V1_URL}/utiles/verifyUser`, { headers: headers, responseType: 'blob' as 'json' });
  }
  downloadPdfFirma() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get<any>(`${environment.API_V1_URL}/utiles/download`, { responseType: 'blob' as 'json' });
  }
}
