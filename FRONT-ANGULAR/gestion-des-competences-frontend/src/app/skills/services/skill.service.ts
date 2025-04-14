import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Skill} from '../models/Skill';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  URL = 'http://localhost:8080/api/skills';
  constructor(private http: HttpClient) { }
  createSkill(skill: Skill): Observable<any> {
    return this.http.post(`${this.URL}/adds`, skill);
  }
  getSkills(): Observable<any>{
    return this.http.get(`${this.URL}/get`);
  }
  updateSkill(skill: Skill): Observable<any>{
    return this.http.put(`${this.URL}/updates`, skill);
  }
  deleteSkill(id: string): Observable<any>{
    return this.http.delete(`${this.URL}/${id}`);
  }
  uploadSkillls(file: any): Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.URL}/upload-file`, formData);
  }

}
