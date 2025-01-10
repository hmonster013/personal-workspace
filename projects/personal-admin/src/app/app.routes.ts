import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SkillsComponent } from './skills/skills.component';
import { ExperiencesComponent } from './experiences/experiences.component';
import { LinksComponent } from './links/links.component';
import { ProjectsComponent } from './projects/projects.component';
import { UserComponent } from './user/user.component';
import { AuthGuard, URI } from 'personal-common';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: { breadcrumb: "Home"},
        canActivate: [AuthGuard],
        children: [
            {
                path: URI.SKILLS,
                data: { breadcrumb: "Skills"},
                component: SkillsComponent
            },
            {
                path: URI.EXPERIENCES,
                data: { breadcrumb: "Experiences"},
                component: ExperiencesComponent
            },
            {
                path: URI.LINKS,
                data: { breadcrumb: "Links"},
                component: LinksComponent
            },
            {
                path: URI.PROJECTS,
                data: { breadcrumb: "Projects"},
                component: ProjectsComponent
            },
            {
                path: URI.USER,
                data: { breadcrumb: "Users"},
                component: UserComponent
            }
        ]
    },
    {
        path: URI.LOGIN,
        component: LoginComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
