import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from '../app.routes';
import { RouterModule } from '@angular/router';
import { SideMenuService } from 'personal-common';

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

  constructor (
    private sideMenuService: SideMenuService,
  ) {
    this.menuItems = this.sideMenuService.getMenuItems();
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
}
