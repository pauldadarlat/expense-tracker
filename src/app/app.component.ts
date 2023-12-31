import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }
}
