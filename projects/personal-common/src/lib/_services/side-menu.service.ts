import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { URI } from '../_utils/URI';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {
  menuItems = [  
    { 
      title: 'Home', 
      link: '/' 
    },
    { 
      title: 'User', 
      link: '/user' 
    },
    { 
      title: 'Blog', 
      link: URI.BLOGS
    },
    { 
      title: 'Skills', 
      link: URI.SKILLS
    },
    { 
      title: 'Experiences', 
      link: URI.EXPERIENCES
    },
    { 
      title: 'Links', 
      link: URI.LINKS
    },
    { 
      title: 'Projects', 
      link: URI.PROJECTS
    },
    {
      title: 'Services',
      children: [
        { 
          title: 'Web Development', 
          link: '/services/web' 
        },
        { 
          title: 'App Development', 
          link: '/services/app' 
        },
      ],
    },
  ]

  constructor() { }

  getMenuItems() {
    return this.menuItems;
  }
}
