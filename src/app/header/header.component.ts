import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/service/auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public title;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.title = 'Legend Keeper Alpha V0.0.3';
  }

  logout() {
    this.authService.logout().subscribe((res) => {
      this.authService.deleteToken();
    },
    error => {console.log(error);
      if (error.status === 401) {
        this.authService.deleteToken();
      } else {
        console.log('Unable to find worlds...');
      }
    });
  }

  isTokenExpired(): boolean {
    return !this.authService.isTokenExpired();
  }

}
