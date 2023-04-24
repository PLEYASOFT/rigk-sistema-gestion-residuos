import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
  saveFile(idDetail: number, fileName: string, file: string, typeFile: number) {
      const formData = new FormData();
      formData.append('idDetail', idDetail.toString());
      formData.append('fileName', fileName);
      formData.append('fileBuffer', file); // Asegúrate de que 'file' contenga el objeto File, no una cadena
      formData.append('typeFile', typeFile.toString());

      const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');

      return this.http.post<any>(`${this.url}/saveFile`, formData, {headers});
}

  getForm(id: any) {
    return this.http.get<any>(`${this.url}/${id}`);
  }
  getMV(id: any) {
    return this.http.get<any>(`${this.url}/detailMV/${id}`);
  }
  downloadMV(id: any): Observable<Blob> {
    return this.http.get<any>(`${this.url}/download/${id}`, {
      responseType: 'blob' as 'json',});
  }
  deleteById(id: any) {
    return this.http.delete<any>(`${this.url}/detailMV/${id}`);
  }
  getFormConsulta(id: any) {
    return this.http.get<any>(`${this.url}/consult/${id}`);
  }
  getDeclarationByID(id_header: any, id_detail: any) {
    return this.http.get<any>(`${this.url}/declaration/${id_header}/${id_detail}`);
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