import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JCode, ModalService, SkillsService, ToastService, ToastStatus, UtilsService } from 'personal-common';

@Component({
  selector: 'app-user-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  @Input() currentSkill: any;
  @Output() outputData = new EventEmitter<any>();
  form: any;
  response: any;

  constructor(
    private modalService: ModalService,
    private toastService: ToastService,
    private skillsService: SkillsService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCurrentData();
  }

  loadCurrentData() {
    if (this.currentSkill) {
      this.form.patchValue({
        id: this.currentSkill.id,
        icon: this.currentSkill.icon,
        name: this.currentSkill.name,
      })
    }
  }
  // Logic của form (create, edit) ở đây
  onSubmit() {
    if (this.currentSkill) {
      this.form.get('id')?.enable();
      const formData = this.utilsService.toFormData(this.form.value);

      this.skillsService.update(formData).subscribe(res => {
        this.response = res;
        if (this.response.status == JCode.SUCCESS) {
          this.toastService.show("Update skill [" + this.currentSkill.id + "] success", ToastStatus.SUCCESS);
          this.outputData.emit({"data": "success"});
        } else {
          this.toastService.show("Update skill [" + this.currentSkill.id + "] error", ToastStatus.ERROR);
        }
      });
    } else {
      const formData = this.utilsService.toFormData(this.form.value);
      this.skillsService.create(formData).subscribe(res => {
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
      icon: new FormControl(''),
      name: new FormControl('')
    })
  }
}
