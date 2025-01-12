import { Component, OnInit, signal } from '@angular/core';
import { ExperiencesService, JCode, JConstants, LinkNames, LinksService, ProjectsService, SkillsService, SkillUiComponent, ToastService, ToastStatus, UtilsService } from 'personal-common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    SkillUiComponent,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  listSkills: any;
  listExperiences: any;
  listProjects: any;
  selectedExperience: any;
  response: any;

  constructor(
    private skillsService: SkillsService,
    private utilsService: UtilsService,
    private toastService: ToastService,
    private experiencesService: ExperiencesService,
    private projectsService: ProjectsService
  ) {

  }

  ngOnInit(): void {
    this.getListSkills();
    this.getListExperiences();
    this.getListProjects();
  }

  getListSkills() {
    let formAll = {
      page: JConstants.PAGE,
      size: JConstants.MAX
    };

    this.skillsService.list(formAll).subscribe(res => {
      this.response = res;
      
      if (this.response.status == JCode.SUCCESS) {
        this.listSkills = this.response.data.list;
      } else {
        this.toastService.show("Load skill error", ToastStatus.ERROR);
      }
    });
  }

  getListExperiences() {
    let formAll = {
      page: JConstants.PAGE,
      size: JConstants.MAX
    };

    this.experiencesService.list(formAll).subscribe(res => {
      this.response = res;
      
      if (this.response.status == JCode.SUCCESS) {
        this.listExperiences = this.response.data.list;
        this.selectedExperience = this.listExperiences[0];
      } else {
        this.toastService.show("Load experience error", ToastStatus.ERROR);
      }
    });
  }

  getListProjects() {
    let formAll = {
      page: JConstants.PAGE,
      size: JConstants.MAX
    }

    this.projectsService.list(formAll).subscribe(res => {
      this.response = res;

      if (this.response.status == JCode.SUCCESS) {
        this.listProjects = this.response.data.list;
      } else {
        this.toastService.show("Load project error", ToastStatus.ERROR);
      }
    })
  }

  changeExperience(experience: any) {
    this.selectedExperience = experience;
  }
}
