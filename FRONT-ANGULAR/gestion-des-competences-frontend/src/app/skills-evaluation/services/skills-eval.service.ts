import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class SkillsEvalService {
  URL = 'http://localhost:8080/api/skillsEval';
  constructor(private http: HttpClient) {
  }

  createSkillEval(skillEval: any): Observable<any> {
    return this.http.post(`${this.URL}`, skillEval);
  }

  getSkillEvaluationsByUser(userId: any): Observable<any> {
    return this.http.get(`${this.URL}/get-by-user-id/${userId}`);
  }

  getUsersWithSkillEval(): Observable<any> {
    return this.http.get('http://localhost:8080/api/users/skillEval');
  }

  validateSkillEvaluations(ids: any): Observable<any> {
    return this.http.patch(`${this.URL}/validate-eval`, ids);
  }

  updateSkillEval(skillEval: any): Observable<any> {
    return this.http.put(`${this.URL}`, skillEval);
  }
}
