// src/app/auth/admin.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const role = this.auth.getRole();  // debe devolver 'ADMIN' o 'USUARIO'
    if (this.auth.isAuthenticated() && role === 'ADMIN') {
      return true;
    }
    // No es admin: redirige al login o a cliente
    return this.router.parseUrl('/login');
  }
}
