import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../../models/user';
import { environment_custom } from 'src/environments/environment.custom';

@Injectable({
  providedIn: 'root',
})

export class LoginService {
  url_login = environment_custom.url_base + 'login';

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  options = { headers: this.headers };

  login (
    user: string,
    password: string
  ): Observable<User> {
    let body = {
      usuario: user,
      password: password
    };
    return this.http.post<User>(`${this.url_login}`, body, this.options);
  }

  ifExist(user: string): Observable<boolean> {
    return of(false);
  }
}
