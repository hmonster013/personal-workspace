import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { BlogService, JCode, ModalService, ProjectsService, SkillsService, SkillUiComponent, ToastService, ToastStatus, UtilsService } from 'personal-common';

@Component({
  selector: 'app-blog-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SkillUiComponent,
    QuillModule
  ],
  templateUrl: './blog-form.component.html',
  styleUrl: './blog-form.component.css'
})
export class BlogFormComponent {
  @Input() currentBlog: any;
  form: any;
  response: any;
  listSkills: any;
  currentSkills: any;
  isDropdownOpen = false;
  selectedFile: File | null = null;
  imageSrc: any;

  // Quill setup
  model: string = '';

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
      ['link', 'image', 'video', 'formula'],
    
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
    
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
    
      ['clean']                                         // remove formatting button
    ]
  };

  constructor(
    private modalService: ModalService,
    private toastService: ToastService,
    private blogsService: BlogService,
    private utilsService: UtilsService,
    private skillsService: SkillsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCurrentData();
    this.getListSkills();
  }

  loadCurrentData() {
    if (this.currentBlog) {
      this.form.patchValue({
        id: this.currentBlog.id,
        title: this.currentBlog.title,
        imgUrl: this.currentBlog.imgUrl,
        content: this.currentBlog.content,
        description: this.currentBlog.description,
        status: this.currentBlog.status,
        createDate: this.currentBlog.createDate,
        updateDate: this.currentBlog.updateDate,
        skillsVOs: this.currentBlog.skillsVOs
      });

      this.currentSkills = this.currentBlog.skillsVOs;
      this.imageSrc = this.currentBlog.imgUrl;
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

    if (this.currentBlog) {
      this.form.get('id')?.enable();
      
      this.blogsService.update(this.form.value, this.selectedFile).subscribe(res => {
        this.response = res;
        if (this.response.status == JCode.SUCCESS) {
          this.toastService.show("Update blog [" + this.currentBlog.id + "] success", ToastStatus.SUCCESS);
          this.router.navigate(['/blogs']);
        } else {
          this.toastService.show("Update blog [" + this.currentBlog.id + "] error", ToastStatus.ERROR);
        }
      });
    } else {
      this.blogsService.create(this.form.value, this.selectedFile).subscribe(res => {
        this.response = res;
        if (this.response.status == JCode.SUCCESS) {
          this.toastService.show("Create blog success", ToastStatus.SUCCESS);
          this.router.navigate(['/blogs']);
        } else {
          this.toastService.show("Create blog error", ToastStatus.ERROR);
        }
      });
    }
  }

  createForm() {
    this.form = new FormGroup({
      id: new FormControl({value: '', disabled: true}),
      title: new FormControl(''),
      imgUrl: new FormControl(''),
      content: new FormControl(''),
      description: new FormControl(''),
      status: new FormControl(''),
      createDate: new FormControl(''),
      updateDate: new FormControl(''),
      skillsVOs: new FormControl('')
    })
  }

  get f() {
    return this.form.controls;
  }
}
