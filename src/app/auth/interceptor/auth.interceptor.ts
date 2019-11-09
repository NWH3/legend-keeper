import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private authService: AuthService;
  private router: Router;

  constructor(private auth: AuthService, private rtr: Router) {
      this.authService = auth;
      this.router = rtr;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.authService.isTokenExpired() && this.authService.getToken() != null) {
      const headers = new HttpHeaders({
       'Authorization': this.authService.getToken()
      });
      request = request.clone({headers});
    } else {
      this.authService.deleteToken();
      this.router.navigateByUrl('app-login');
    }

    return next.handle(request);
  }
}
