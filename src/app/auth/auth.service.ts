import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from '../shared/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private userService: UserService) {}

  login(username: string, password: string): Observable<boolean> {
    return this.userService.getUserById(username).pipe(
      switchMap((user) => {
        if (user && user.password === password) {
          user.isLoggedIn = true;
          this.userService.setUser(user);
          return of(true);
        } else {
          return of(false);
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  isUserLoggedIn(): boolean {
    const user = this.userService.getCurrentUser();
    return !!user && user.isLoggedIn;
  }

  logout(): void {
    const user = this.userService.getCurrentUser();
    if (user) {
      user.isLoggedIn = false;
      this.userService.setUser(user);
    }
  }
}
