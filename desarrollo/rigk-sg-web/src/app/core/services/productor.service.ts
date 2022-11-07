import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductorService {

  url = `${environment.API_V1_URL}/auth`;

  constructor(private http: HttpClient) { }

  login(user:string,password:string) {

    // const tmp = {
    //   status: true,
    //   data: [... ""]
    // }

    return this.http.post<any>(`${this.url}/login`, {user,password});
  }

}
