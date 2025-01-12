import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { URI } from '../_utils/URI';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  constructor(private http: HttpClient) { }

  list(formData: any) {
    return this.http.post(`${environment.apiUrl}/${URI.V1}/${URI.LINKS}/${URI.LIST}`, formData);
  }

  getById(id: string) {
    return this.http.get(`${environment.apiUrl}/${URI.V1}/${URI.LINKS}/${id}`);
  }

  getByListName(listName: any) {
    let nameString = listName.join(',');

    return this.http.get(`${environment.apiUrl}/${URI.V1}/${URI.LINKS}/${URI.VIEW}/${URI.LIST}/${nameString}`);
  }

  create(formData: any) {
    return this.http.post(`${environment.apiUrl}/${URI.V1}/${URI.LINKS}`, formData);
  }

  update(formData: any) {
    return this.http.put(`${environment.apiUrl}/${URI.V1}/${URI.LINKS}`, formData);
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/${URI.V1}/${URI.LINKS}/${id}`);
  }
}
