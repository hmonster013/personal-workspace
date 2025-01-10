import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JCode, LinksService, ModalService, ToastService, ToastStatus, UtilsService } from 'personal-common';

@Component({
  selector: 'app-links-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './links-form.component.html',
  styleUrl: './links-form.component.css'
})
export class LinksFormComponent {
  @Input() currentLink: any;
  @Output() outputData = new EventEmitter<any>();
  form: any;
  response: any;

  constructor(
    private modalService: ModalService,
    private toastService: ToastService,
    private linksService: LinksService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCurrentData();
  }

  loadCurrentData() {
    if (this.currentLink) {
      this.form.patchValue({
        id: this.currentLink.id,
        name: this.currentLink.name,
        title: this.currentLink.title,
        url: this.currentLink.url,
        icon: this.currentLink.icon
      })
    }
  }

  onSubmit() {
    if (this.currentLink) {
      this.form.get('id')?.enable();
      const formData = this.utilsService.toFormData(this.form.value);

      this.linksService.update(formData).subscribe(res => {
        this.response = res;
        if (this.response.status == JCode.SUCCESS) {
          this.toastService.show("Update link [" + this.currentLink.id + "] success", ToastStatus.SUCCESS);
          this.outputData.emit({"data": "success"});
        } else {
          this.toastService.show("Update link [" + this.currentLink.id + "] error", ToastStatus.ERROR);
        }
      });
    } else {
      const formData = this.utilsService.toFormData(this.form.value);
      this.linksService.create(formData).subscribe(res => {
        this.response = res;
        if (this.response.status == JCode.SUCCESS) {
          this.toastService.show("Create link success", ToastStatus.SUCCESS);
          this.outputData.emit({"data": "success"});
        } else {
          this.toastService.show("Create link error", ToastStatus.ERROR);
        }
      });
    }
    this.modalService.close();
  }

  createForm() {
    this.form = new FormGroup({
      id: new FormControl({value: '', disabled: true}),
      name: new FormControl(''),
      title: new FormControl(''),
      url: new FormControl(''),
      icon: new FormControl(''),
    })
  }
}
