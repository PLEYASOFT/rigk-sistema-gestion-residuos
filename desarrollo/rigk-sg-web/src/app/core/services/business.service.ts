import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  url = `${environment.API_V1_URL}/business`;

  constructor(private http: HttpClient) { }

  verifyBusiness(id: string) {
    return this.http.get<any>(`${this.url}/verify/${id}`);
  }

  getBusiness(id: string) {
    return this.http.get<any>(`${this.url}/business/${id}`);
  }
  getBusinessByUserId(id: any) {
    return this.http.get<any>(`${this.url}/getBusinessByUserId/${id}`);
  }
  getCodeBusiness(idBusiness: any) {
    return this.http.get<any>(`${this.url}/getCodeBusiness/${idBusiness}`);
  }
  getBusinessById(id: string, year: string) {
    return this.http.get<any>(`${this.url}/businessById/${id}/${year}`);
  }
  getBusinessByCode(code: string) {
    return this.http.get<any>(`${this.url}/businessByCode/${code}`);
  }
  getBusinessByVAT(vat: string){
    return this.http.get<any>(`${this.url}/business/vat/${vat}`);
  }
  checkEstablishmentBusinessRelation(establishmentId: number, businessId: number, specificType: number){
    return this.http.get<any>(`${this.url}/business/check/${establishmentId}/${businessId}/${specificType}`);
  }
  get getBusinessByUser() {
    return this.http.get<any>(`${this.url}/user`);
  }

  getAllBusiness(){
    return this.http.get<any>(`${this.url}/business/`);
  }

  postBusiness(name:any, vat:any, loc_address:any, phone:any, email:any,am_first_name:any,am_last_name:any,invoice_name:any,invoice_email:any,invoice_phone:any, code_business:any, giro:any){
    return this.http.post<any>(`${this.url}/business/`, {name, vat, loc_address, phone, email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business, giro});
  }

  deleteBusiness(id: any) {
    return this.http.delete<any>(`${this.url}/business/${id}`);
  }

  updateBusiness(id: any,name:any, vat:any, loc_address:any, phone:any, email:any,am_first_name:any,am_last_name:any,invoice_name:any,invoice_email:any,invoice_phone:any, code_business:any, giro:any) {
    return this.http.put<any>(`${this.url}/business/${id}`, {name, vat, loc_address, phone, email, am_first_name, am_last_name, invoice_name, invoice_email, invoice_phone, code_business, giro});
  }
}
