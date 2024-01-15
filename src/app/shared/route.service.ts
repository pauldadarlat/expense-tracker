import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  currentRoute: string = '';
  previousRoute: string = '';
  nextRoute: string = '';

  private routes = ['user', ...this.daysOfWeek.map(day => day.toLowerCase()), 'summary'];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this.getCurrentRoute();

        const currentRouteIndex = this.routes.indexOf(this.currentRoute);

        this.previousRoute = currentRouteIndex > 0 ? '/' + this.routes[currentRouteIndex - 1] : '';
        this.nextRoute = currentRouteIndex < this.routes.length - 1 ? '/' + this.routes[currentRouteIndex + 1] : '';
      });
  }

  private getCurrentRoute(): string {
    const currentUrl = this.router.url;
    const currentRoute = currentUrl.split('/')[1];
    return currentRoute;
  }
}