import { Component } from '@angular/core';
import { AuthenticationService, ThemeService } from 'personal-common';
import { flatMap } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isDarkMode = false;

  constructor(
    private themeService: ThemeService,
    private authenticationService: AuthenticationService
  ) {}

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.toggleTheme(this.isDarkMode);
  }

  logout() {
    this.authenticationService.logout();
  }
}
