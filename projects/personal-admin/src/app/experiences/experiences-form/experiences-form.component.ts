import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExperiencesService, JCode, ModalService, ToastService, ToastStatus, UtilsService } from 'personal-common';
import { QuillConfigModule, QuillModule } from 'ngx-quill';
import Quill from 'quill';

@Component({
  selector: 'app-experiences-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    QuillModule
  ],
  templateUrl: './experiences-form.component.html',
  styleUrl: './experiences-form.component.css'
})
export class ExperiencesFormComponent {
  @Input() currentExperience: any;
  @Output() outputData = new EventEmitter<any>();
  form: any;
  response: any;
  selectedFile: File | null = null;
  imageSrc: string | ArrayBuffer | null = null;

  model: string = '';

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote'],

      // [{'header': 1}, {'header': 2}],               // custom button values
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
      [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
      [{'direction': 'rtl'}],                         // text direction

      // [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
      // [{'header': [1, 2, 3, 4, 5, 6, false]}],

      // [{'color': []}, {'background': []}],
      // [{'font': []}],
      [{'align': []}],

      ['clean'],                                       // remove formatting button

      // ['link', 'image', 'video',]                   // link and image, video
      ['link']                                         // link

    ]
  };

  constructor(
    private modalService: ModalService,
    private toastService: ToastService,
    private experienceService: ExperiencesService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCurrentData();
  }

  loadCurrentData() {
    if (this.currentExperience) {
      this.form.patchValue({
        id: this.currentExperience.id,
        companyName: this.currentExperience.companyName,
        companyImg: this.currentExperience.companyImg,
        jobTitle: this.currentExperience.jobTitle,
        description: this.currentExperience.description,
        workingPeriod: this.currentExperience.workingPeriod,
        startDate: this.currentExperience.startDate,
        endDate: this.currentExperience.endDate
      });

      this.imageSrc = this.currentExperience.companyImg;
    }
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
  
  onSubmit() {
    if (this.currentExperience) {
      this.form.get('id')?.enable();

      this.experienceService.update(this.form.value, this.selectedFile).subscribe(res => {
        this.response = res;
        if (this.response.status == JCode.SUCCESS) {
          this.toastService.show("Update experience [" + this.currentExperience.id + "] success", ToastStatus.SUCCESS);
          this.outputData.emit({"data": "success"});
        } else {
          this.toastService.show("Update experience [" + this.currentExperience.id + "] error", ToastStatus.ERROR);
        }
      });
    } else {
      this.experienceService.create(this.form.value, this.selectedFile).subscribe(res => {
        this.response = res;
        console.log(this.response.status);
        if (this.response.status == JCode.SUCCESS) {
          this.toastService.show("Create experience success", ToastStatus.SUCCESS);
          this.outputData.emit({"data": "success"});
        } else {
          this.toastService.show("Create experience error", ToastStatus.ERROR);
        }
      });
    }
    this.modalService.close();
  }

  createForm() {
    this.form = new FormGroup({
      id: new FormControl({value: '', disabled: true}),
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
