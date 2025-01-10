import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SkillsFormComponent } from './skills-form/skills-form.component';
import { BreadcrumbComponent, JCode, ModalService, SkillsService, SkillUiComponent, ToastService, ToastStatus } from 'personal-common';

@Component({
  selector: 'app-skills',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BreadcrumbComponent,
],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})
export class SkillsComponent implements OnInit, OnDestroy{
  form: any;
  listSkills: any;
  response: any;
  page: number = 1;
  size: number = 10;
  totalRows: any;
  totalPages: any;
  listPage: any;
  activePopup: number | null = null;

  constructor(
    private router: Router,
    private skillsService: SkillsService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {

  }

  ngOnInit(): void {
    this.createFormGroup();
    this.initListSkills();
  }

  initListSkills() {
    this.getListSkills({
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

  view(currentSkill: any) {
    const modalRef = this.modalService.open(SkillUiComponent);

    if (modalRef != null) {
      modalRef.instance.currentSkill = currentSkill;
    } else {
      this.toastService.show("ERROR", ToastStatus.ERROR);
    }
  }

  create() {
    const modalRef = this.modalService.open(SkillsFormComponent);

    if (modalRef != null) {
      modalRef.instance.outputData.subscribe((result) => {
        console.log(result.data);
        this.initListSkills();
      });
    } else {
      this.toastService.show("ERROR", ToastStatus.ERROR);
    }
  }

  edit(currentSkill: any) {
    const modalRef = this.modalService.open(SkillsFormComponent);
    
    if (modalRef != null) {
      modalRef.instance.currentSkill = currentSkill;
      modalRef.instance.outputData.subscribe((result) => {
        console.log(result.data);
        this.initListSkills();
      });
    } else {
      this.toastService.show("ERROR", ToastStatus.ERROR);
    }

  }

  remove(skillId: any) {
    this.skillsService.delete(skillId).subscribe(res => {
      this.response = res;
      if (this.response.status == JCode.SUCCESS) {
        this.toastService.show("Delete skill id [" + skillId + "] success", ToastStatus.SUCCESS);
        this.initListSkills();
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

    this.getListSkills(this.form.value);
  }

  getListSkills(formData: any) {
    this.skillsService.list(formData).subscribe(res => {
      this.response = res;
      if (this.response.status == '000') {
        this.listSkills = this.response.data.list;
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
    
    this.getListSkills(this.form.value);
  }

  createFormGroup() {
    this.form = new FormGroup({
      id: new FormControl(''),
      name: new FormControl(''),
      page: new FormControl(''),
      size: new FormControl('')
    })
  }
}
