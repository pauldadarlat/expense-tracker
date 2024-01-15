import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
  ): Observable<boolean | UrlTree> {
    return this.authService.isUserLoggedIn().pipe(
      map((loggedIn) => {
        if (loggedIn) {
          return true;
        } else {
          const urlTree: UrlTree = this.router.createUrlTree(['/login']);
          return urlTree;
        }
      })
    );
  }
}
