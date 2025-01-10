import { Component, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { JCode, JConstants, SkillsService, SkillUiComponent, ToastService, ToastStatus, UtilsService } from 'personal-common';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent, 
    FooterComponent, 
    SkillUiComponent,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  listSkills: any;
  response: any;

  constructor(
    private skillsService: SkillsService,
    private utilsService: UtilsService,
    private toastService: ToastService
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
