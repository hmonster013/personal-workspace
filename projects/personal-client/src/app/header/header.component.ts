import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../_services/theme.service';
import { flatMap } from 'rxjs';
import { JCode, LinkNames, LinksService, ToastService, ToastStatus } from 'personal-common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isDarkMode = false;
  isMenuOpen = false;
  response: any;
  dictLinks: any;

  constructor(
    private themeService: ThemeService,
    private linksService: LinksService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getListLinks();    
  }

  getListLinks() {
    let listLinkName = [LinkNames.FACEBOOK, LinkNames.TELEGRAM,
                      LinkNames.GITHUB, LinkNames.LINKEDIN
    ]

    this.linksService.getByListName(listLinkName).subscribe(res => {
      this.response = res;

      if (this.response.status == JCode.SUCCESS) {
        this.dictLinks = this.response.data;
      } else {
        this.toastService.show("Load project error", ToastStatus.ERROR);
      }
    })
  }

  goToHome() {
    this.router.navigate(['']);
  }

  get githubLink() {
    return this.dictLinks ? this.dictLinks[LinkNames.GITHUB] : "#";
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.toggleTheme(this.isDarkMode);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu) {
      sideMenu.classList.toggle('open', this.isMenuOpen);
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    const sideMenu = document.getElementById('sideMenu');
    if (sideMenu) {
      sideMenu.classList.remove('open');
    }
  }
}
