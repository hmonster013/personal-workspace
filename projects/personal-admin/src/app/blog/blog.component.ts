import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { BlogService, BreadcrumbComponent, JCode, ModalService, ProjectsService, SkillUiComponent, ToastService, ToastStatus } from 'personal-common';
import { ListSkillsComponent } from '../projects/list-skills/list-skills.component';
import { ProjectsFormComponent } from '../projects/projects-form/projects-form.component';
import { BlogFormComponent } from './blog-form/blog-form.component';

@Component({
  selector: 'app-blog',
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    SkillUiComponent,
    ReactiveFormsModule,
    BlogFormComponent
],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  form: any;
  listBlogs: any;
  response: any;
  page: number = 1;
  size: number = 10;
  totalRows: any;
  totalPages: any;
  listPage: any;
  isFormOpen = false;
  selectedBlog: any;
  activePopup: number | null = null;

  constructor(
    private router: Router,
    private blogsService: BlogService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {

  }

  ngOnInit(): void {
    this.createFormGroup();
    this.initListBlogs();
  }

  initListBlogs() {
    this.getListBlogs({
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
      this.initListBlogs();
    } else {
      this.toastService.show("ERROR", ToastStatus.ERROR);
    }
  }

  create() {
    this.isFormOpen = true;
    this.selectedBlog = null;
  }

  edit(currentBlog: any) {
    this.isFormOpen = true;
    this.selectedBlog = currentBlog;
  }

  remove(blogId: any) {
    this.blogsService.delete(blogId).subscribe(res => {
      this.response = res;
      if (this.response.status == JCode.SUCCESS) {
        this.toastService.show("Delete blog id [" + blogId + "] success", ToastStatus.SUCCESS);
        this.initListBlogs();
      } else {
        this.toastService.show("Delete blog id [" + blogId + "] error", ToastStatus.ERROR);
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

    this.getListBlogs(this.form.value);
  }

  getListBlogs(formData: any) {
    this.blogsService.list(formData).subscribe(res => {
      this.response = res;
      if (this.response.status == '000') {
        this.listBlogs = this.response.data.list;
        this.totalPages = this.response.data.paging.totalPages;
        this.totalRows = this.response.data.paging.totalRows;
        this.setListPage(this.totalPages);
      } else if (this.response.status == '001') {
        this.router.navigate(['/access-deny'])
      }
    });
  }

  onSubmit() {
    this.form.patchValue({
      page: 1,
      size: this.size,
    });
    
    this.getListBlogs(this.form.value);
  }

  createFormGroup() {
    this.form = new FormGroup({
      id: new FormControl(''),
      page: new FormControl(''),
      size: new FormControl(''),
      name: new FormControl('')
    })
  }
}
