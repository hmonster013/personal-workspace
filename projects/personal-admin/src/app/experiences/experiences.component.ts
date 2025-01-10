import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SkillsFormComponent } from '../skills/skills-form/skills-form.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExperiencesFormComponent } from './experiences-form/experiences-form.component';
import { BreadcrumbComponent, ExperiencesService, JCode, ModalService, ToastService, ToastStatus } from 'personal-common';

@Component({
  selector: 'app-experiences',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BreadcrumbComponent
  ],
  templateUrl: './experiences.component.html',
  styleUrl: './experiences.component.css'
})
export class ExperiencesComponent {
  form: any;
  listExperiences: any;
  response: any;
  page: number = 1;
  size: number = 10;
  totalRows: any;
  totalPages: any;
  listPage: any;
  activePopup: number | null = null;

  constructor(
    private router: Router,
    private experiencesService: ExperiencesService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {

  }

  ngOnInit(): void {
    this.createFormGroup();
    this.initListExperiences();
  }

  initListExperiences() {
    this.getListExperiences({
      page: 1,
      size: this.size
    })
  }

  ngOnDestroy(): void {
      
  }

  //POPUP
  openPopup(experienceId: number) {
    if (this.activePopup === experienceId) {
      this.activePopup = null;
    } else {
      this.activePopup = experienceId;
    }
  }

  create() {
    this.modalService.open(ExperiencesFormComponent);
  }

  edit(currentExperience: any) {
    const modalRef = this.modalService.open(ExperiencesFormComponent);
    
    if (modalRef != null) {
      modalRef.instance.currentExperience = currentExperience;
      modalRef.instance.outputData.subscribe((result) => {
        console.log(result.data);
        this.initListExperiences();
      });
    } else {
      this.toastService.show("ERROR", ToastStatus.ERROR);
    }

  }

  remove(experienceId: any) {
    this.experiencesService.delete(experienceId).subscribe(res => {
      this.response = res;
      if (this.response.status == JCode.SUCCESS) {
        this.toastService.show("Delete experience id [" + experienceId + "] success", ToastStatus.SUCCESS);
        this.initListExperiences();
      } else {
        this.toastService.show("Delete experience id [" + experienceId + "] error", ToastStatus.ERROR);
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

    this.getListExperiences(this.form.value);
  }

  getListExperiences(formData: any) {
    this.experiencesService.list(formData).subscribe(res => {
      this.response = res;
      if (this.response.status == '000') {
        this.listExperiences = this.response.data.list;
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
    
    this.getListExperiences(this.form.value);
  }

  createFormGroup() {
    this.form = new FormGroup({
      id: new FormControl(''),
      page: new FormControl(''),
      size: new FormControl(''),
      companyName: new FormControl(''),
      companyImg: new FormControl(''),
      jobTitle: new FormControl(''),
      description: new FormControl(''),
      workingPeriod: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl('')
    })
  }
}
