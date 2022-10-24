import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ip } from '../../models/ip';

@Injectable({
  providedIn: 'root'
})
export class IpService {
  url_base = 'http://api.ipify.org/?format=json';
constructor(private http: HttpClient) { }


ip(): Observable<Ip> {
    return this.http
      .get<Ip>(this.url_base);
  }


}
