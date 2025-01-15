import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkillUiComponent } from "../skill-ui/skill-ui.component";

@Component({
  selector: 'lib-blog-card-ui',
  imports: [
    CommonModule,
    SkillUiComponent
],
  templateUrl: './blog-card-ui.component.html',
  styleUrl: './blog-card-ui.component.css'
})
export class BlogCardUiComponent {
  @Input() currentBLog: any;
}
