import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'lib-skill-ui',
  templateUrl: './skill-ui.component.html',
  styleUrls: ['./skill-ui.component.css'],
})
export class SkillUiComponent implements OnInit{
  @Input() currentSkill: any;
  sanitizedIcon: SafeHtml | null = null;

  constructor(private sanitizer: DomSanitizer) {
  }
  
  ngOnInit() {
    if (this.currentSkill?.icon) {
      this.sanitizedIcon = this.sanitizer.bypassSecurityTrustHtml(this.currentSkill.icon);
    }
  }
}
