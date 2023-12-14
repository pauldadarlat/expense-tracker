import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  currentRoute: string = '';
  previousRoute: string = '';
  nextRoute: string = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.getCurrentRoute();
        const routes = [
          'user',
          'mon',
          'tue',
          'wed',
          'thu',
          'fri',
          'sat',
          'sun',
          'summary',
        ];

        const currentRouteIndex = routes.indexOf(this.currentRoute);

        if (currentRouteIndex === 0) {
          this.previousRoute = '';
        } else {
          this.previousRoute = '/' + routes[currentRouteIndex - 1];
        }

        if (currentRouteIndex === routes.length - 1) {
          this.nextRoute = '';
        } else {
          this.nextRoute = '/' + routes[currentRouteIndex + 1];
        }
      });
  }

  private getCurrentRoute(): string {
    const currentUrl = this.router.url;
    const currentRoute = currentUrl.split('/')[1];
    return currentRoute;
  }
}
