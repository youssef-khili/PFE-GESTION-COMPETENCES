import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Category} from "../models/Category";

@Injectable({
  providedIn: 'root'
})
export class CategoryServiceService {

  URL = 'http://localhost:8080/api/categories';
  constructor(private http: HttpClient) { }
  createCategory(category: Category): Observable<any> {
    return this.http.post(`${this.URL}/addCat`, category);
  }
  getCategories(): Observable<any>{
    return this.http.get(`${this.URL}/getCat`);
  }
  updateCategory(category: Category): Observable<any>{
    return this.http.put(`${this.URL}/updateCat`, category);
  }
  deleteCategory(id: string): Observable<any>{
    return this.http.delete(`${this.URL}/${id}`);
  }
  uploadCategories(file: any): Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.URL}/upload-file`, formData);
  }

}
