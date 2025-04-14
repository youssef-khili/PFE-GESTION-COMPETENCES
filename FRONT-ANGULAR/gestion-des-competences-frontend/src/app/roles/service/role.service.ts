import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Role} from '../models/Role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  URL = 'http://localhost:8080/api/roles';
  constructor(private http: HttpClient) { }
  createRole(role: Role): Observable<any> {
    return this.http.post(`${this.URL}`, role);
  }
  getRoles(): Observable<any>{
    return this.http.get(`${this.URL}`);
  }

  updateRole(role: Role): Observable<any>{
    return this.http.put(`${this.URL}`, role);
  }
  uploadRoles(file: any): Observable<any>{
    const formData = new FormData();

    formData.append('file', file);
    return this.http.post(`${this.URL}/upload-file`, formData);
  }
  deleteRole(id: string): Observable<any>{
    return this.http.delete(`${this.URL}/${id}`);
  }
}
