import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JCode, JConstants, SkillsService, ToastService, ToastStatus, UtilsService } from 'personal-common';
import { SkillUiComponent } from "../../../../personal-common/src/lib/skill-ui/skill-ui.component";

@Component({
  selector: 'app-about',
  imports: [
    CommonModule,
    SkillUiComponent
],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit{
  form: any;
  listSkills: any;
  response: any;

  constructor(
    private skillsService: SkillsService,
    private utilsService: UtilsService,
    private toastService: ToastService,
  ) {

  }

  ngOnInit(): void {
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
