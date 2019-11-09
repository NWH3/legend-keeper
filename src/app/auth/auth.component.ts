import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { JSEncrypt } from 'jsencrypt';
import { MatProgressSpinnerModule } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

   private readonly incorrectCredentials = 'Incorrect credentials.';
   private readonly servicesError = 'Our services are not responding... please try again later or reach out to our support team.';

   public username;
   public password;
   public isLoading = false;

   constructor(private authService: AuthService,
                private router: Router) {
   }

   ngOnInit() {
   }

  loginWithEvent(event) {
    if (event.code == 'Enter') {
      this.login();
    }
  }

  login() {
   if (this.username && this.password) {
      // Get RSA public Key
      this.authService.deleteToken();
      this.isLoading = true;
      this.authService.getPublicKey()
        .subscribe(key => {
         this.isLoading = true;
          const encrypt = new JSEncrypt();
          encrypt.setPublicKey(key);
          const encrypted = encrypt.encrypt('{"username":"' + this.username + '", "password":"' + this.password + '"}');
          // Authenticate user with encrypted credentials
          this.authService.login(encrypted)
              .subscribe(
                  res => {
                    this.authService.setToken(res.headers.get('Authorization'));
                    this.authService.setUsername(this.username);
                    this.isLoading = false;
                    this.password = '';
                    this.router.navigateByUrl('app-world');
                  },
                  error => {
                    this.isLoading = false;
                    document.getElementById('error-message').innerHTML = this.incorrectCredentials;
                  }
              );
        },
        error => {
          this.isLoading = false;
          document.getElementById('error-message').innerHTML = this.servicesError;
        });
    }
   }

}
