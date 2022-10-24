import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Auth } from '../../models/auth';
import { environment_custom } from 'src/environments/environment.custom';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url_base = environment_custom.url_base + 'login';
  api_key = environment_custom.apy_key;
  constructor(private http: HttpClient) {}

 headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'API-Key':this.api_key.toString(),
 'Authorization':"Basic "+btoa(environment_custom.userLogin+":"+environment_custom.passwdLogin)
  });
  options = { headers: this.headers };

  auth(
    usuario: string,
    password: string
  ): Observable<Auth> {
    let body = {
      user: usuario,
      pass: password
    };
    return this.http.post<Auth>(`${this.url_base}`, body, this.options);
  }

  ifExist(user: string): Observable<boolean> {
    return of(false);
  }
}
