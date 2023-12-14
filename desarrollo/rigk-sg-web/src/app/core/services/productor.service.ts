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

  getBusinessByRolProductor(){
    return this.http.get<any>(`${this.url}/getBusinessByRolProductor`);
  }

  getDetailByIdHeader(id_header: number) {
    return this.http.get<any>(`${this.url}/detail/${id_header}`);
  }
  getProductor(id: number) {
    return this.http.get<any>(`${this.url}/${id}`);
  }
  getResumeById(id: string, year: number) {
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
    return this.http.put<any>(`${this.url}/validate/${id}`, {});
  }
  verifyDraft(id_business: any, year: any) {
    return this.http.get<any>(`${this.url}/draft/${id_business}/year/${year}`);
  }
  verifyDJ(id_business: any, id: any) {
    return this.http.get<any>(`${this.url}/dj/${id_business}/id/${id}`);
  }
  businessUserDJ(id_user: any) {
    return this.http.get<any>(`${this.url}/businessDJ/${id_user}`);
  }
  deleteDJ(id_business: any, id_user: any) {
    return this.http.delete<any>(`${this.url}/dj/delete/${id_business}/${id_user}`);
  }
  downloadPDF(id_business: any, year: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get<any>(`${this.url}/pdf/${id_business}/year/${year}`, { headers: headers, responseType: 'blob' as 'json' });
  }
  uploadOC(id: any, file: any) {
    const body = new FormData();
    body.append('file', file[0]);
    return this.http.post<any>(`${this.url}/OC/${id}`, body);
  }
  downloadPDFTerminos() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get<any>(`${environment.API_V1_URL}/utiles/download/pdf`, { headers: headers, responseType: 'blob' as 'json' });
  }
  uploadPDFTerminos(file: any, idEmpresa: any, idUsuario: any) {
    const body = new FormData();
    body.append('file', file);
    return this.http.post<any>(`${environment.API_V1_URL}/utiles/upload/pdf/${idEmpresa}/${idUsuario}`, body);
  }
  veryfyPDFTerminos() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.post<any>(`${environment.API_V1_URL}/utiles/verifyUser`, { headers: headers, responseType: 'blob' as 'json' });
  }
  downloadPdfFirma(idEmpresa: any, idUsuario: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.http.get<any>(`${environment.API_V1_URL}/utiles/download/${idEmpresa}/${idUsuario}`, { responseType: 'blob' as 'json' });
  }
}
