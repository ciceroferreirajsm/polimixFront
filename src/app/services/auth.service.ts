import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5098/api/Account';

  constructor(private http: HttpClient) {}

  login(userName: string, password: string, language: string = 'pt-BR'): Observable<any> {
    const loginData = {
      userName,
      password,
      language
    };

    return this.http.post(`${this.apiUrl}/LogOn`, loginData);
  }
}
