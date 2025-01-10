import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { URI } from '../_utils/URI';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/${URI.V1}/${URI.USER}/${URI.LIST}`);
  }
}
