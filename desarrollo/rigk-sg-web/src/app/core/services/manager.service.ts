import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  url = `${environment.API_V1_URL}/manager`;

  constructor(private http: HttpClient) { }

  getAllManager(){
    return this.http.get<any>(`${this.url}/all/`);
  }

  addManager(type_material:any, region:any, id_business:any){
    console.log(type_material, region, id_business)
    return this.http.post<any>(`${this.url}/add/`, {type_material, region,id_business});
  }

  deleteManager(id: any) {
    return this.http.delete<any>(`${this.url}/delete/${id}`);
  }

  getManager(id: string) {
    return this.http.get<any>(`${this.url}/${id}`);
  }


}
