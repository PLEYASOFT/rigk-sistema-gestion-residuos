import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentService {
  url = `${environment.API_V1_URL}/establishment`;

  constructor(private http: HttpClient) { }

  getAllEstablishment(){
    return this.http.get<any>(`${this.url}/all/`);
  }

  addEstablishment(name:any, region:any, id_business:any){
    return this.http.post<any>(`${this.url}/add/`, {name, region,id_business});
  }

  deleteEstablishment(id: any) {
    return this.http.delete<any>(`${this.url}/delete/${id}`);
  }

  getEstablishment(id: string) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  getDeclarationEstablishment(){
    return this.http.get<any>(`${this.url}/declaration/`);
  }

}
