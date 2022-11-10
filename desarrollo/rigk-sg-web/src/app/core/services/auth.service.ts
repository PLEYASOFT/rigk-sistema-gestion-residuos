import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = `${environment.API_V1_URL}`;

  constructor(private http: HttpClient) { }

  login(user:string,password:string) {
    return this.http.post<any>(`${this.url}/auth`, {user,password});
  }

  sendCode(user:string) {
    return this.http.post<any>(`${this.url}/auth/sendCode`, {user});
  }

  verifyCode(code:string,user:string){
    return this.http.post<any>(`${this.url}/auth/sendCode/verify`, {code, user});
  }

  recovery(user:string,password:string,repeatPassword:string){
    return this.http.post<any>(`${this.url}/auth/sendCode/recovery`, {user, password,repeatPassword});
  }
}
