import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { AboutComponent } from './about/about.component';
import { URI } from 'personal-common';

export const routes: Routes = [
    {
        path: '', 
        component: HomeComponent
    },
    {
        path: URI.BLOGS,
        component: BlogComponent
    },
    {
        path: URI.ABOUT,
        component: AboutComponent
    },
    {
        path: '**/*',
        redirectTo: ''
    }
];
