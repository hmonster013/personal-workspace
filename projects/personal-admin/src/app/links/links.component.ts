import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LinksFormComponent } from './links-form/links-form.component';
import { BreadcrumbComponent, JCode, LinksService, ModalService, ToastService, ToastStatus } from 'personal-common';

@Component({
  selector: 'app-links',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    BreadcrumbComponent
  ],
  templateUrl: './links.component.html',
  styleUrl: './links.component.css'
})
export class LinksComponent {
  form: any;
  listLinks: any;
  response: any;
  page: number = 1;
  size: number = 10;
  totalRows: any;
  totalPages: any;
  listPage: any;
  activePopup: number | null = null;

  constructor(
    private router: Router,
    private linksService: LinksService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {

  }

  ngOnInit(): void {
    this.createFormGroup();
    this.initListLinks();
  }

  initListLinks() {
    this.getListLinks({
      page: 1,
      size: this.size
    })
  }

  ngOnDestroy(): void {
      
  }

  //POPUP
  openPopup(linkId: number) {
    if (this.activePopup === linkId) {
      this.activePopup = null;
    } else {
      this.activePopup = linkId;
    }
  }

  create() {
    const modalRef = this.modalService.open(LinksFormComponent);

    if (modalRef != null) {
      modalRef.instance.outputData.subscribe((result) => {
        console.log(result.data);
        this.initListLinks();
      });
    } else {
      this.toastService.show("ERROR", ToastStatus.ERROR);
    }
  }

  edit(currentLinks: any) {
    const modalRef = this.modalService.open(LinksFormComponent);
    
    if (modalRef != null) {
      modalRef.instance.currentLink = currentLinks;
      modalRef.instance.outputData.subscribe((result) => {
        console.log(result.data);
        this.initListLinks();
      });
    } else {
      this.toastService.show("ERROR", ToastStatus.ERROR);
    }

  }

  remove(linkId: any) {
    this.linksService.delete(linkId).subscribe(res => {
      this.response = res;
      if (this.response.status == JCode.SUCCESS) {
        this.toastService.show("Delete link id [" + linkId + "] success", ToastStatus.SUCCESS);
        this.initListLinks();
      } else {
        this.toastService.show("Delete link id [" + linkId + "] error", ToastStatus.ERROR);
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

    this.getListLinks(this.form.value);
  }

  getListLinks(formData: any) {
    this.linksService.list(formData).subscribe(res => {
      this.response = res;
      if (this.response.status == '000') {
        this.listLinks = this.response.data.list;
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
    
    this.getListLinks(this.form.value);
  }

  createFormGroup() {
    this.form = new FormGroup({
      id: new FormControl(''),
      page: new FormControl(''),
      size: new FormControl(''),
      name: new FormControl(''),
      title: new FormControl(''),
      url: new FormControl(''),
      icon: new FormControl(''),
    })
  }
}
