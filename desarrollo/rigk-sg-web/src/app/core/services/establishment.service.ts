import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {
  url = `${environment.API_V1_URL}/establishment`;

  constructor(private http: HttpClient) { }

  getAllEstablishment() {
    return this.http.get<any>(`${this.url}/all/`);
  }

  getInovice(invoice_number: any, vat: any, treatment_type: any, material_type: any, id_business: any) {
    return this.http.post<any>(`${this.url}/get/invoice/`, { invoice_number, vat, treatment_type, material_type, id_business });
  }

  saveInvoice(vat: any, id_business: any, invoice_number: any, id_detail: any, date_pr: any, value: any, valued_total: any, treatment: any, id_material: any, file: File) {
    const formData: FormData = new FormData();
    formData.append('vat', vat);
    formData.append('id_business', id_business);
    formData.append('invoice_number', invoice_number);
    formData.append('id_detail', id_detail);
    formData.append('date_pr', date_pr);
    formData.append('value', value);
    formData.append('valued_total', valued_total);
    formData.append('treatment', treatment);
    formData.append('id_material', id_material);
    formData.append('file', file, file.name);

    return this.http.post<any>(`${this.url}/invoice/`, formData);
  }

  addEstablishment(name: any, region: any, id_business: any) {
    return this.http.post<any>(`${this.url}/add/`, { name, region, id_business });
  }

  deleteEstablishment(id: any) {
    return this.http.delete<any>(`${this.url}/delete/${id}`);
  }

  getEstablishment(id: string) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  getEstablishmentByID(id: string) {
    return this.http.get<any>(`${this.url}/get/${id}`);
  }

  getDeclarationEstablishment() {
    return this.http.get<any>(`${this.url}/declaration/`);
  }

}
