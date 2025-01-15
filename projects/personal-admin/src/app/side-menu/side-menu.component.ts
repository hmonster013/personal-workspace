import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from '../app.routes';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SideMenuService } from 'personal-common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-side-menu',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {
  menuItems: any;
  dropdownStates: Map<string, boolean> = new Map();
  activeItem: any;
  isCollapsed = false;

  constructor (
    private sideMenuService: SideMenuService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.menuItems = this.sideMenuService.getMenuItems();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveItemFromUrl(event.urlAfterRedirects);
      }
    });

    this.setActiveItemFromUrl(this.router.url);
  }

  setActiveItemFromUrl(url: string): void {
    const segments = url.split('/');
    const lastSegment = segments[segments.length - 1];
    this.activeItem = lastSegment;


    const matchingItem = this.menuItems.find((item: {title: string, icon: string, link: string}) => item.link.endsWith(lastSegment));
    this.activeItem = matchingItem ? matchingItem.title : '';
  }

  toggleDropdown(key: string, event: Event): void {
    event.preventDefault();
    const currentState = this.dropdownStates.get(key) || false;
    this.dropdownStates.set(key, !currentState);
  }

  isDropdownOpen(key: string): boolean {
    return this.dropdownStates.get(key) || false;
  }

  onLinkClick(itemTitle: any): void {
    this.activeItem = itemTitle;
  }

  getSanitizedIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  onCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
