import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscriber, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

const BASE_URL = 'http://193.124.114.46:3001';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    return this.http.post<any>(BASE_URL + '/sessions/create', { email, password })
      .pipe(
        tap((res: any) => {
          this.setSession(res);
        })
      );
  }

  private setSession(authResult) {
    if (authResult && authResult.id_token) {
      // const expiresAt = moment().add(authResult.expiresIn, 'second');
      localStorage.setItem('pw:authUser', JSON.stringify({ id_token: authResult.id_token }));
    }
  }

  registration(username: string, email: string, password: string) {
    return this.http.post<any>(BASE_URL + '/users', { username, email, password })
      .pipe(
        tap((res: any) => {

          this.setSession(res);
        })
      );
  }

  getToken() {
    const currentUser = JSON.parse(localStorage.getItem('pw:authUser'));
    if (!currentUser || !currentUser.id_token) {
      return null;
    } else {
      return currentUser.id_token;
    }
  }

  isAuthenticated() {
    // return moment().isBefore(this.getExpiration());
    return this.getToken() != null;
  }

  logout() {
    localStorage.removeItem('pw:authUser');
  }

}
