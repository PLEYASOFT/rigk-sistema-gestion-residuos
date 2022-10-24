import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login/login.service';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class CheckRolGuard implements CanActivate {
  constructor(
    private sessionDataService: StorageService,
    private loginService: LoginService,
    private router: Router
  ) { }

  redirect(ruta: string) {
    this.router.navigate([ruta]);
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const expectedRol = route.data['expectedRol'];
    let permisoIs: boolean = false;
    const sessionData =
      this.sessionDataService.getSessionDataUser() != false
        ? this.sessionDataService.getSessionDataUser()
        : null;

    if (sessionData == null) {
      this.redirect('');
      //location.reload();
    } else {
      this.loginService.ifExist('plop').subscribe((rest) => {
        for (const rol of expectedRol) {
          const rol = sessionData.rol.find(
            (rolSession: any) => rolSession.descripcion == rol
          );
          if (rol != undefined) {
            permisoIs = true;
            break;
          }
        }

        if (!permisoIs) {
          this.redirect('');
        }
      });
    }
    return permisoIs;
  }
}
