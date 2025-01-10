import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public toFormData(formValue: Record<string, any>): FormData {
    const formData = new FormData();
  
    Object.entries(formValue).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    return formData;
  }  
}
