import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, pipe, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = `${environment.API_V1_URL}/auth`;

  constructor(private http: HttpClient) { }

  login(user: string, password: string) {
    return this.http.post<any>(`${this.url}`, { user, password }, { observe: 'response' }).pipe(
      tap(r => {
        const token = r.headers.get('x-token');
        sessionStorage.setItem('token', token!);
      })
    );
  }
  sendCode(user: string) {
    return this.http.post<any>(`${this.url}/sendCode`, { user });
  }
  verifyCode(code: string, user: string) {
    return this.http.post<any>(`${this.url}/sendCode/verify`, { code, user });
  }
  recovery(user: string, password: string, repeatPassword: string) {
    return this.http.post<any>(`${this.url}/sendCode/recovery`, { user, password, repeatPassword });
  }
  modifyPassword(repeatPassword: string, newPassword: string, actual: string) {
    return this.http.post<any>(`${this.url}/modifyPassword`, { newPassword, actual, repeatPassword });
  }
  get getUsers() {
    return this.http.get<any>(`${this.url}/`);
  }
  get getRoles(){
    return this.http.get<any>(`${this.url}/roles`);
  }
  deleteUser(id:any) {
    return this.http.delete<any>(`${this.url}/${id}`);
  }
  registerUser(data:any) {
    return this.http.post<any>(`${this.url}/register`, data);
  }
  updateUser(data:any) {
    return this.http.put<any>(`${this.url}/`, data);
  } 
}
