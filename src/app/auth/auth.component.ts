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
    this.error = null;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    const authObservable = this.isLoginMode
      ? this.authService.login(email, password)
      : this.authService.signup(email, password);

    authObservable.subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/user']);
        } else {
          console.error('Authentication failed');
          this.error = 'Authentication failed';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Authentication error:', error);
        this.error = 'Authentication error';
        this.isLoading = false;
      },
      complete: () => {
        form.reset();
      },
    });
  }
}
