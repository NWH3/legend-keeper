import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import * as JWTDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private AUTHORIZATION = 'Authorization';

    private tokenName = 'secret';
    private username = 'username';
    private dev = 'dev';

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    getPublicKey() {
      return this.httpClient.get (environment.gatewayBaseUrl + 'key', {responseType: 'text'});
    }

    login(secret: string ): Observable<HttpResponse<any>> {
      return this.httpClient.post<HttpResponse<any>>(environment.gatewayBaseUrl + 'login', {secret}, { observe: 'response'});
    }

    logout(): Observable<HttpResponse<any>> {
      return this.httpClient.get<HttpResponse<any>>(environment.gatewayBaseUrl + 'logout', { observe: 'response'});
    }

    getUsername(): string {
      if (!environment.production) {
        return this.dev;
      }
      return localStorage.getItem(this.username);
    }

    setUsername(username: string): void {
      localStorage.setItem(this.username, username);
    }

    getToken(): string {
      if (!environment.production) {
        return this.dev;
      }
      return localStorage.getItem(this.tokenName);
    }

    setToken(token: string): void {
      localStorage.setItem(this.tokenName, token);
    }

    refreshToken(res: HttpResponse<any>): void {
      if (res != null
        && res.headers != null
        && res.headers.get(this.AUTHORIZATION) != null) {
        localStorage.setItem(this.tokenName, res.headers.get(this.AUTHORIZATION));
      }
    }

    deleteToken(): void {
      localStorage.removeItem(this.tokenName);
      localStorage.removeItem(this.username);
      localStorage.clear();
      this.router.navigate(['app-login']);
    }

    isTokenExpired(token?: string): boolean {
      if (!environment.production) {
        return false;
      }
      if (!token) {
         token = this.getToken();
      }
      if (!token) {
        return true;
      }
      const date = this.getTokenExpirationDate(token);
      if (date === undefined) {
        return false;
      }
      return !(date.valueOf() > new Date().valueOf());
    }

    private getTokenExpirationDate(token?: string): Date {
      if (!token) {
        token = this.getToken();
      }
      const decoded = JWTDecode(token);
      if (decoded.exp === undefined) {
        return null;
      }
      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date;
    }
}
