import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {User} from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  URL = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.URL}`, user);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.URL}`);
  }

  getUsersFullnames(): Observable<any> {
    return this.http.get(`${this.URL}/get-fullnames`);
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(`${this.URL}`, user);
  }

  uploadUsers(file: any): Observable<any> {
    const formData = new FormData();

    formData.append('file', file);
    return this.http.post(`${this.URL}/upload-file`, formData);
  }

  disableUsers(id: string): Observable<any> {
    return this.http.delete(`${this.URL}/disable/${id}`);
  }

  deleteUsers(id: string): Observable<any> {
    return this.http.delete(`${this.URL}/delete/${id}`);
  }


}
