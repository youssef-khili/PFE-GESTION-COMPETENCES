import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenService} from "../../shared/services/token.service";
import {Observable} from "rxjs/Observable";

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  URL = 'http://localhost:8080/api/skills';

  constructor(private http: HttpClient) {
  }

  getSkills(): Observable<any> {
    return this.http.get(`${this.URL}/get`);
  }

  getSkillsNames(): Observable<any> {
    return this.http.get(`${this.URL}/get-names`);
  }

  getSkillsByIds(skills: any): Observable<any> {
    return this.http.get(`${this.URL}/get-by-ids/${skills}`);
  }
}
