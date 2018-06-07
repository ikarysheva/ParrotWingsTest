import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../shared/models/user.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

const BASE_URL = 'http://193.124.114.46:3001/api/protected';

interface UserInfo {
  user_info_token: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  balaceChanged = new Subject<number>();
  curentUserChanged = new Subject<User>();

  private currentUser: User;

  constructor(private http: HttpClient,
    private router: Router) { }

  getUserInfo() {
    return this.http.get<UserInfo>(BASE_URL + '/user-info')
      .pipe(
        map((res: UserInfo) => {
          if (res && res.user_info_token) {
            return res.user_info_token;
          }
          return null;
        }),
        catchError(this.handleError.bind(this))
      ).subscribe(this.setCurrentUser.bind(this));
  }

  private setCurrentUser(user: User) {
    if (user) {
      this.currentUser = user;
      this.curentUserChanged.next(user);
      this.balaceChanged.next(this.currentUser.balance);
    }
    return this.currentUser;
  }

  getUserList(filter?: string): Observable<User[]> {
    return this.http.post<User[]>(BASE_URL + '/users/list', { filter })
      .pipe(
        tap((res: User[]) => {
          // console.log('user: ' + res);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  get balance() {
    return this.currentUser ? this.currentUser.balance : 0;
  }

  set balance(balance: number) {
    this.currentUser.balance = balance;
    this.balaceChanged.next(balance);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);

      if (error.status === 401) {
        this.router.navigate(['/signin']);
      }
    }
    return throwError(error.error);
  }
}
