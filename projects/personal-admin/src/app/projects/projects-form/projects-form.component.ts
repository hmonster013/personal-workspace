import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JCode, ModalService, ProjectsService, SkillsService, ToastService, ToastStatus, UtilsService } from 'personal-common';
import { SkillUiComponent } from "../../../../../personal-common/src/lib/skill-ui/skill-ui.component";
import { ListSkillsComponent } from "../list-skills/list-skills.component";

@Component({
  selector: 'app-projects-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SkillUiComponent
],
  templateUrl: './projects-form.component.html',
  styleUrl: './projects-form.component.css'
})
export class ProjectsFormComponent {
  @Input() currentProject: any;
  @Output() outputData = new EventEmitter<any>();
  form: any;
  response: any;
  listSkills: any;
  currentSkills: any;
  isDropdownOpen = false;
  selectedFile: File | null = null;
  imageSrc: any;

  constructor(
    private modalService: ModalService,
    private toastService: ToastService,
    private projectsService: ProjectsService,
    private utilsService: UtilsService,
    private skillsService: SkillsService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCurrentData();
    this.getListSkills();
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
        skillsVOs: this.currentProject.skillsVOs
      });

      this.currentSkills = this.currentProject.skillsVOs;
      this.imageSrc = this.currentProject.img;
    } else {
      this.currentSkills = [];
    }

  }

  getListSkills() {
    this.skillsService.list({page: 1, size: 999999}).subscribe(res => {
      this.response = res;
      if (this.response.status = JCode.SUCCESS) {
        this.listSkills = this.response.data.list;
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile!);
    }
  }

  addSkill(skill: any) {
    this.currentSkills.push(skill);
  }

  removeSkill(skill: any) {
    this.currentSkills = this.currentSkills.filter((s: {id: number, icon: string, name: string}) => s !== skill);
  }
  
  onSubmit() {
    this.form.patchValue({
      skillsVOs: this.currentSkills
    });

    if (this.currentProject) {
      this.form.get('id')?.enable();
      
      this.projectsService.update(this.form.value, this.selectedFile).subscribe(res => {
        this.response = res;
        if (this.response.status == JCode.SUCCESS) {
          this.toastService.show("Update skill [" + this.currentProject.id + "] success", ToastStatus.SUCCESS);
          this.outputData.emit({"data": "success"});
        } else {
          this.toastService.show("Update skill [" + this.currentProject.id + "] error", ToastStatus.ERROR);
        }
      });
    } else {
      this.projectsService.create(this.form.value, this.selectedFile).subscribe(res => {
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
      skillsVOs: new FormControl('')
    })
  }
}
