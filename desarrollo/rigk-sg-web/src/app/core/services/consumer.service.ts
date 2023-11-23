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
    if (data.detail.files) {
      for (let j = 0; j < data.detail.files.length; j++) {
        const file = data.detail.files[j];
        body.append(`f_${data.detail.sub}_${data.detail.treatment}_${file.type}`, file.file);
      }
    }
    body.append("header", JSON.stringify(data.header));
    body.append("detail", JSON.stringify(data.detail));
    return this.http.post<any>(`${this.url}`, body);
  }
  saveFile(idDetail: number, fileName: string, file: string, typeFile: number) {
    const formData = new FormData();
    formData.append('idDetail', idDetail.toString());
    formData.append('fileName', fileName);
    formData.append('fileBuffer', file);
    formData.append('typeFile', typeFile.toString());

    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');

    return this.http.post<any>(`${this.url}/saveFile`, formData, { headers });
  }

  getForm(id: any) {
    return this.http.get<any>(`${this.url}/${id}`);
  }
  getMV(id: any) {
    return this.http.get<any>(`${this.url}/detailMV/${id}`);
  }
  downloadMV(id: any): Observable<Blob> {
    return this.http.get<any>(`${this.url}/download/${id}`, {
      responseType: 'blob' as 'json',
    });
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
  verifyMaterial(material_id: any, submaterial_id: any) {
    return this.http.get<any>(`${this.url}/verifyMaterial/${material_id}/${submaterial_id}`);
  }
  verifyGestor(manager_id:any, material:any) {
    return this.http.get<any>(`${this.url}/verifyGestor/${manager_id}/${material}`);
  }
  downloadExcel(id_business: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.ms-excel');
    return this.http.get<any>(`${this.url}/excel/${id_business}`, { headers: headers, responseType: 'blob' as 'json' });
  }
  downloadExcelDeclarationCI(year: any) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.ms-excel');
    return this.http.get<any>(`${this.url}/excel_ci/${year}`, { headers: headers, responseType: 'blob' as 'json' });
  }
  checkRow(row: any) {
    return this.http.post<any>(`${this.url}/verifyRow/`, row);
  }
  saveHeaderFromExcel(formData: any) {
    return this.http.post(`${this.url}/headerForm`, formData);
  }
  saveDetailFromExcel(formData: any) {
    return this.http.post(`${this.url}/detailForm`, formData);
  }
}