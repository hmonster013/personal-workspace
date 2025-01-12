import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JCode, LinkNames, LinksService, ToastService, ToastStatus } from 'personal-common';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{
  response: any;
  dictLinks: any;

  constructor(
    private linksService: LinksService,
    private toastService: ToastService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.getListLinks();
  }

  goToHome() {
    this.router.navigate(['']);
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

  get facebookLink() {
    return this.dictLinks ? this.dictLinks[LinkNames.FACEBOOK] : "#";
  }

  get linkedInLink() {
    return this.dictLinks ? this.dictLinks[LinkNames.LINKEDIN] : "#";
  }

  get telegramLink() {
    return this.dictLinks ? this.dictLinks[LinkNames.TELEGRAM] : "#";
  }

  get githubLink() {
    return this.dictLinks ? this.dictLinks[LinkNames.GITHUB] : "#";
  }
}
