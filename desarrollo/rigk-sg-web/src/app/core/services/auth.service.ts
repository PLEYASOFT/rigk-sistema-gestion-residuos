import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = `${environment.API_V1_URL}/auth`;

  constructor(private http: HttpClient) { }

  login(user:string,password:string) {
    return this.http.post<any>(`${this.url}`, {user,password}, {observe: 'response'}).pipe(
      tap(r => {
        const token = r.headers.get('x-token');
        sessionStorage.setItem('token', token!);
      }),
      catchError(err=>of(err.error)),map(r => {console.log(r); return r})
    );
  }

  sendCode(user:string) {
    return this.http.post<any>(`${this.url}/sendCode`, {user}).pipe(
      catchError(err=>of(err.error))
    );
  }

  verifyCode(code:string,user:string){
    console.log(code, user)
    return this.http.post<any>(`${this.url}/sendCode/verify`, {code, user}).pipe(
      catchError(err=>of(err.error))
    );
  }

  recovery(user:string,password:string,repeatPassword:string){
    return this.http.post<any>(`${this.url}/sendCode/recovery`, {user, password,repeatPassword}).pipe(
      catchError(err=>of(err.error))
    );
  }
  modifyPassword(password:string,newPassword:string, actual:string){
    return this.http.post<any>(`${this.url}/modifyPassword`, {newPassword, actual}, {headers:{"x-token":sessionStorage.getItem("token")!}});
  }
}
