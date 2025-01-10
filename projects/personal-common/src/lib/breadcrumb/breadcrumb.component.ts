import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit{
  breadcrumbs: Array<{ label: string; url: string }> = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
  this.router.events.subscribe(() => {
      this.breadcrumbs = [];
      let currentRoute = this.route.root;
      let url = '';

      while (currentRoute.children.length) {
        const child = currentRoute.children[0];
        const routeConfig = child.snapshot.routeConfig;

        if (routeConfig && routeConfig.data && routeConfig.data['breadcrumb']) {
          url += `/${child.snapshot.url.map((segment) => segment.path).join('/')}`;
          this.breadcrumbs.push({ label: routeConfig.data['breadcrumb'], url });
        }
        currentRoute = child;
      }
    });
  }
}
