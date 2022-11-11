import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductorService {

  url = `${environment.API_V1_URL}/statement`;

  constructor(private http: HttpClient) { }

  saveForm(data: any) {
    console.log(data)
    return this.http.post<any>(`${this.url}`, data,{headers: {
      "x-token": sessionStorage.getItem('token')!
    }}).pipe(
      catchError(err=>of(err.error))
    );
  }
  
  getValueStatementByYear(id_business:any, year:number) {
    return this.http.get<any>(`${this.url}/${id_business}/year/${year}`, {headers: {
      "x-token": sessionStorage.getItem('token')!
    }}).pipe(
      catchError(err => of(err.error))
    );
  }

}
