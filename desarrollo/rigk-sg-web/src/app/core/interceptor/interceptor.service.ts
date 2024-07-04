import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      "x-token": token
    });

    const reqClone = req.clone({
      headers
    });

    return next.handle(reqClone).pipe(
      catchError((error: HttpErrorResponse | any) => {
        const urlArray = error.url.split('/');
        const finalUrl = urlArray.pop();
        if(finalUrl != 'auth' && error.status==401){
          Swal.fire({
            icon: 'error',
            text: 'Sesión expirada'
          })
          this.router.navigate(['/auth/login'], { queryParams: { logout: true } });
          return throwError(() => error.error);
        }
        else{
          //this.router.navigate(['/auth/login'], { queryParams: { logout: true } });
          return throwError(() => error.error);
        }
      })
  );

  }
}