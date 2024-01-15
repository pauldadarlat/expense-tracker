import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  isUserLoggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isUserLoggedIn().subscribe((loggedIn: boolean) => {
      this.isUserLoggedIn = loggedIn;
      console.log(this.isUserLoggedIn);
    });
  }
}
