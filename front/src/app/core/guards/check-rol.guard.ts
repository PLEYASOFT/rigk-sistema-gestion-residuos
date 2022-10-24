import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { StorageService } from '../services/util/storage.service';

@Injectable({
  providedIn: 'root',
})
export class CheckRolGuard implements CanActivate {
  constructor(
    private _sessionDataService: StorageService,
    private _authService: AuthService,
    private router: Router
  ) {}

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
      this._sessionDataService.getSessionDataUser() != false
        ? this._sessionDataService.getSessionDataUser()
        : null;

    if (sessionData == null) {
      this.redirect('');
      //location.reload();
    } else {
      this._authService.ifExist('jlucero_admin').subscribe((rest) => {
        for (const rol of expectedRol) {
          const listaPerfiles = sessionData.listaPerfiles.find(
            (rolSession: any) => rolSession.descripcion == rol
          );
          if (listaPerfiles != undefined) {
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
