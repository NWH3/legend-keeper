import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './service/auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private authService: AuthService) {

    }

    canActivate() {
      if (!this.authService.isTokenExpired() || !environment.production) {
        return true;
      }

      this.router.navigate(['app-login']);
      return false;
    }
}
