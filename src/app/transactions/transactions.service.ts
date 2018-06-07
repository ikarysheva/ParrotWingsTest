import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Transaction } from '../shared/models/transaction.model';
import { Subject, throwError } from 'rxjs';
import { UserService } from '../core/user.service';
import { CustomDateAdapter } from '../core/custom.dateadapter';
import { DateAdapter } from '@angular/material';
import { Router } from '@angular/router';

const BASE_URL = 'http://193.124.114.46:3001/api/protected';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  transactionsChanged = new Subject<Transaction[]>();

  private transactions: Transaction[];


  constructor(private http: HttpClient,
    private userService: UserService,
    private dateAdapter: DateAdapter<any>,
    private router: Router) {
  }

  loadTransactions() {
    return this.http.get<any>(BASE_URL + '/transactions')
      .pipe(
        map((res: any) => {
          let transactions: Transaction[];
          this.transactions = [];
          if (res && res.trans_token) {
            transactions = res.trans_token;
            for (const item of transactions) {
              item.date = this.dateAdapter.parse(item.date, 'YYYY-MM-DD hh:mm:ss');
            }
          }
          this.transactions = transactions;
          return this.transactions;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  createTransaction(name: string, amount: number) {
    return this.http.post<any>(BASE_URL + '/transactions', { name, amount })
      .pipe(
        tap((res: any) => {
          if (res && res.trans_token) {
            const transaction = res.trans_token;
            this.userService.balance = transaction.balance;
            transaction.date = this.dateAdapter.parse(transaction.date, 'YYYY-MM-DD hh:mm:ss');
            this.transactions.push(transaction);
          }
        }),
        catchError(this.handleError.bind(this))
      );
  }

  async getTransactions() {
    return this.transactions || await this.loadTransactions().toPromise();
  }

  async getTransactionById(id: number) {
    const transactions = await this.getTransactions();
    for (const item of transactions) {
      if (item.id === id) {
        return item;
      }
    }
    return null;
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
    return throwError(
      error.error);
  }
}
