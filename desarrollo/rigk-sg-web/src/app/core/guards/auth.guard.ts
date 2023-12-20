import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = sessionStorage.getItem('token');
    const userJson = sessionStorage.getItem('user');
    let userRole = '';

    if (userJson) {
      const user = JSON.parse(userJson);
      userRole = user.ROL.toString();
    }

    if (token && userRole) {
      const rolesPermitidos = route.data['rolesPermitidos'] as Array<string>;
      if (rolesPermitidos.includes(userRole)) {
        return true;
      } else {
        this.redirectToHomeBasedOnRole(userRole);
        return false;
      }
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }

  private redirectToHomeBasedOnRole(userRole: string) {
    switch(userRole) {
      case '9':
        this.router.navigate(['/productor']);
        break;
      case '10':
        this.router.navigate(['/mantenedor']);
        break;
      case '11':
        this.router.navigate(['/consumidor']);
        break;
      case '12':
        this.router.navigate(['/gestor']);
        break;
      default:
        this.router.navigate(['/auth']);
        break;
    }
  }
}
