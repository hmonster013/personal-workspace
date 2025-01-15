import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BlogComponent } from './blog/blog.component';
import { AboutComponent } from './about/about.component';
import { BlogUiComponent, URI } from 'personal-common';
import { combineLatest } from 'rxjs';
import { Component } from '@angular/core';

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
        path: URI.BLOGS + URI.ID,
        component: BlogUiComponent
    },
    {
        path: '**/*',
        redirectTo: ''
    }
];
