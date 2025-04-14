import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  URL = 'http://localhost:8080/api/skillsEval';

  constructor(private http: HttpClient) {
  }

  getHistogramChartValues(): Observable<any> {
    return this.http.get(`${this.URL}/report`);
  }

  applyFilter(skills: any, userId: any, department: any): Observable<any> {
    const params = {skills, userId, department};
    return this.http.get(`${this.URL}/report`, {params});
  }
}
