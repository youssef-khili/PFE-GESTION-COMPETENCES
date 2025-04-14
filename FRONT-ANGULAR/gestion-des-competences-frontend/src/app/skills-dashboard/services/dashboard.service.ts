import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  URL = 'http://localhost:8080/api/skillsEval';

  constructor(private http: HttpClient) {
  }

  getDashboardEvaluation(): any {
    return this.http.get(`${this.URL}/get-by-skills`);
  }

  applyFilter(skills: any, minLevel: any, users: any, departments: any): any {
    const params = {skills, minLevel, users, departments};

    return this.http.get(`${this.URL}/filter`, {
        params
      }
    );
  }
}
