import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  url = `${environment.API_V1_URL}/manager`;

  constructor(private http: HttpClient) { }

  getAllManager() {
    return this.http.get<any>(`${this.url}/all/`);
  }

  addManager(type_material: any, region: any, id_business: any) {
    console.log(type_material, region, id_business)
    return this.http.post<any>(`${this.url}/add/`, { type_material, region, id_business });
  }

  deleteManager(id: any) {
    return this.http.delete<any>(`${this.url}/delete/${id}`);
  }

  getManager(id: string) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  getAllMaterials() {
    return this.http.get<any>(`${this.url}/allMaterials/`);
  }

  getAllTreatments() {
    return this.http.get<any>(`${this.url}/allTreatments/`);
  }

  getAllRegions(){
    return this.http.get<any>(`${this.url}/regiones/`)
  }

  getAllCommunes(){
    return this.http.get<any>(`${this.url}/comunas/`)
  }

  getAllSubmaterial(){
    return this.http.get<any>(`${this.url}/submaterial/`)
  }

  getAllSubmaterialFormatted(){
    return this.http.get<any>(`${this.url}/submaterialFormatted/`)
  }

  getManagersByMaterials(materials: any[], region: string, comuna:any) {
    const materialsParam = materials.join(',');
    return this.http.get<any>(`${this.url}/materials/${materialsParam}/region/${region}/comuna/${comuna}`);
  }

  downloadExcelTemplateInvoice() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.ms-excel');
    return this.http.get<any>(`${this.url}/excel`, { headers: headers, responseType: 'blob' as 'json' });
  }

}
