import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  URL = 'http://localhost:8080/api/departments';
  constructor(private http: HttpClient) { }
  createDepartment(data: any): Observable<any> {
    return this.http.post(`${this.URL}/add`, data);
  }
  getDepartments(): Observable<any>{
    return this.http.get(`${this.URL}/get`);
  }

  updateDepartment(data: any): Observable<any>{
    return this.http.put(`${this.URL}/update`, data);
  }
  uploadDepartments(file: any): Observable<any>{
    const formData = new FormData();

    formData.append('file', file);
    return this.http.post(`${this.URL}/upload-file`, formData);
  }
  deleteDepartment(id: string): Observable<any>{
    return this.http.delete(`${this.URL}/delete/${id}`);
  }
}
