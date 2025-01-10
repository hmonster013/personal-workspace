import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExperiencesService, JCode, ModalService, ToastService, ToastStatus, UtilsService } from 'personal-common';

@Component({
  selector: 'app-experiences-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './experiences-form.component.html',
  styleUrl: './experiences-form.component.css'
})
export class ExperiencesFormComponent {
  @Input() currentExperience: any;
  @Output() outputData = new EventEmitter<any>();
  form: any;
  response: any;

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
      })
    }
  }
  
  onSubmit() {
    if (this.currentExperience) {
      this.form.get('id')?.enable();
      const formData = this.utilsService.toFormData(this.form.value);

      this.experienceService.update(formData).subscribe(res => {
        this.response = res;
        if (this.response.status == JCode.SUCCESS) {
          this.toastService.show("Update experience [" + this.currentExperience.id + "] success", ToastStatus.SUCCESS);
          this.outputData.emit({"data": "success"});
        } else {
          this.toastService.show("Update experience [" + this.currentExperience.id + "] error", ToastStatus.ERROR);
        }
      });
    } else {
      const formData = this.utilsService.toFormData(this.form.value);
      this.experienceService.create(formData).subscribe(res => {
        this.response = res;
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
