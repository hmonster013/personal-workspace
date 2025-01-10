import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JCode, ModalService, ProjectsService, ToastService, ToastStatus, UtilsService } from 'personal-common';
import { SkillUiComponent } from "../../../../../personal-common/src/lib/skill-ui/skill-ui.component";
import { ListSkillsComponent } from "../list-skills/list-skills.component";

@Component({
  selector: 'app-projects-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ListSkillsComponent
],
  templateUrl: './projects-form.component.html',
  styleUrl: './projects-form.component.css'
})
export class ProjectsFormComponent {
  @Input() currentProject: any;
  @Output() outputData = new EventEmitter<any>();
  form: any;
  response: any;

  constructor(
    private modalService: ModalService,
    private toastService: ToastService,
    private projectsService: ProjectsService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCurrentData();
  }

  loadCurrentData() {
    if (this.currentProject) {
      this.form.patchValue({
        id: this.currentProject.id,
        name: this.currentProject.name,
        img: this.currentProject.img,
        description: this.currentProject.description,
        linkGithub: this.currentProject.linkGithub,
        linkWebsite: this.currentProject.linkWebsite,
        startDate: this.currentProject.startDate,
        endDate: this.currentProject.endDate,
        projects: this.currentProject.projects
      })
    }
  }
  
  onSubmit() {
    if (this.currentProject) {
      this.form.get('id')?.enable();
      const formData = this.utilsService.toFormData(this.form.value);

      this.projectsService.update(formData).subscribe(res => {
        this.response = res;
        if (this.response.status == JCode.SUCCESS) {
          this.toastService.show("Update skill [" + this.currentProject.id + "] success", ToastStatus.SUCCESS);
          this.outputData.emit({"data": "success"});
        } else {
          this.toastService.show("Update skill [" + this.currentProject.id + "] error", ToastStatus.ERROR);
        }
      });
    } else {
      const formData = this.utilsService.toFormData(this.form.value);
      this.projectsService.create(formData).subscribe(res => {
        this.response = res;
        if (this.response.status == JCode.SUCCESS) {
          this.toastService.show("Create skill success", ToastStatus.SUCCESS);
          this.outputData.emit({"data": "success"});
        } else {
          this.toastService.show("Create skill error", ToastStatus.ERROR);
        }
      });
    }
    this.modalService.close();
  }

  createForm() {
    this.form = new FormGroup({
      id: new FormControl({value: '', disabled: true}),
      name: new FormControl(''),
      img: new FormControl(''),
      description: new FormControl(''),
      linkGithub: new FormControl(''),
      linkWebsite: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      projects: new FormControl(''),
    })
  }
}
