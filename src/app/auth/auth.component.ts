import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const username = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    if (this.isLoginMode) {
      this.authService.login(username, password).subscribe(
        (success) => {
          if (success) {
            this.router.navigate(['/user']);
          } else {
            console.error('Login failed');
            this.error = 'Authentication failed';
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Login error:', error);
          this.error = 'Authentication error';
          this.isLoading = false;
        }
      );

      form.reset();
    }
  }
}
