import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  pages: string[] = ['User', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Summary'];

  constructor(private authService: AuthService, private userService: UserService) {}
  logout(): void {
    this.authService.logout().subscribe(() => {
      this.userService.setUser(null);
    });
  }
}
