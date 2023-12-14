import { Component } from '@angular/core';
import { RouteService } from '../shared/route.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  previousPage: string = '';
  nextPage: string = '';
  isUserPage: boolean = false;
  isSummaryPage: boolean = false;

  constructor(private routeService: RouteService) {
    this.previousPage = this.transformRoute(this.routeService.previousRoute);
    this.nextPage = this.transformRoute(this.routeService.nextRoute);
    this.isUserPage = this.routeService.currentRoute === 'user';
    this.isSummaryPage = this.routeService.currentRoute === 'summary';
  }

  showPreviousButton(): boolean {
    if (
      this.routeService.previousRoute.length === 0 ||
      this.routeService.currentRoute.length === 0
    ) {
      return false;
    } else return true;
  }

  showNextButton(): boolean {
    if (
      this.routeService.nextRoute.length === 0 ||
      this.routeService.currentRoute.length === 0
    )
      return false;
    else return true;
  }

  getPreviousPageLink(): string {
    return this.routeService.previousRoute || '/';
  }

  getNextPageLink(): string {
    return this.routeService.nextRoute || '/';
  }

  getPreviousPageName(): string {
    return this.transformRoute(this.routeService.previousRoute) || '';
  }

  getNextPageName(): string {
    return this.transformRoute(this.routeService.nextRoute) || '';
  }

  private transformRoute(route: string): string {
    const routeWithoutSlash = route.substring(1);
    const formattedRoute =
      routeWithoutSlash.charAt(0).toUpperCase() + routeWithoutSlash.slice(1);
    return formattedRoute;
  }
}
