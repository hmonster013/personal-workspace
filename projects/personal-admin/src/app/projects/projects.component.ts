import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectsFormComponent } from './projects-form/projects-form.component';
import { BreadcrumbComponent, JCode, ModalService, ProjectsService, SkillUiComponent, ToastService, ToastStatus } from 'personal-common';
import { ListSkillsComponent } from './list-skills/list-skills.component';

@Component({
  selector: 'app-projects',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BreadcrumbComponent,
    SkillUiComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  form: any;
  listProjects: any;
  response: any;
  page: number = 1;
  size: number = 10;
  totalRows: any;
  totalPages: any;
  listPage: any;
  activePopup: number | null = null;

  constructor(
    private router: Router,
    private projectsService: ProjectsService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {

  }

  ngOnInit(): void {
    this.createFormGroup();
    this.initListProjects();
  }

  initListProjects() {
    this.getListProjects({
      page: 1,
      size: this.size
    })
  }

  ngOnDestroy(): void {
      
  }

  //POPUP
  openPopup(skillId: number) {
    if (this.activePopup === skillId) {
      this.activePopup = null;
    } else {
      this.activePopup = skillId;
    }
  }

  viewListSkills(listSkills: any) {
    const modalRef = this.modalService.open(ListSkillsComponent);
    
    if (modalRef != null) {
      modalRef.instance.listSkills = listSkills;
      this.initListProjects();
    } else {
      this.toastService.show("ERROR", ToastStatus.ERROR);
    }
  }

  create() {
    this.modalService.open(ProjectsFormComponent);
  }

  edit(currentSkill: any) {
    const modalRef = this.modalService.open(ProjectsFormComponent);
    
    if (modalRef != null) {
      modalRef.instance.currentProject = currentSkill;
      modalRef.instance.outputData.subscribe((result) => {
        console.log(result.data);
        this.initListProjects();
      });
    } else {
      this.toastService.show("ERROR", ToastStatus.ERROR);
    }

  }

  remove(skillId: any) {
    this.projectsService.delete(skillId).subscribe(res => {
      this.response = res;
      if (this.response.status == JCode.SUCCESS) {
        this.toastService.show("Delete skill id [" + skillId + "] success", ToastStatus.SUCCESS);
        this.initListProjects();
      } else {
        this.toastService.show("Delete skill id [" + skillId + "] error", ToastStatus.ERROR);
      }
    });
  }

  setListPage(totalPages: any) {
    this.listPage = [];
    for (let i = 1; i <= totalPages; i++) {
      this.listPage.push(i)
    }
  }

  goToPage(page: any) {
    this.page = page;

    this.form.patchValue({
      page: this.page,
      size: this.size,
    });

    this.getListProjects(this.form.value);
  }

  getListProjects(formData: any) {
    this.projectsService.list(formData).subscribe(res => {
      this.response = res;
      if (this.response.status == '000') {
        this.listProjects = this.response.data.list;
        this.totalPages = this.response.data.paging.totalPages;
        this.totalRows = this.response.data.paging.totalRows;
        this.setListPage(this.totalPages);
      } else if (this.response.status == '001') {
        this.router.navigate(['/access-deny'])
      }
    })
  }

  onSubmit() {
    this.form.patchValue({
      page: 1,
      size: this.size,
    });
    
    this.getListProjects(this.form.value);
  }

  createFormGroup() {
    this.form = new FormGroup({
      id: new FormControl(''),
      page: new FormControl(''),
      size: new FormControl(''),
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
