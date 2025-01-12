import { Component } from '@angular/core';
import { BlogCardUiComponent, JCode, JConstants, SkillsService, SkillUiComponent, ToastService, ToastStatus, UtilsService } from 'personal-common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [
    BlogCardUiComponent, 
    SkillUiComponent,
    CommonModule
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  listSkills: any;
  response: any;

  constructor(
    private skillsService: SkillsService,
    private utilsService: UtilsService,
    private toastService: ToastService,
  ) {
    this.getListSkills();
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
}
