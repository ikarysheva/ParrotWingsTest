import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Transaction } from '../shared/models/transaction.model';
import { TransactionsService } from './transactions.service';
import { Observable } from 'rxjs';

@Injectable()
export class TransactionResolver implements Resolve<Observable<Transaction[]>> {

    constructor(
        private transactionService: TransactionsService
    ) {
    }

    public resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Transaction[]> {
        return this.transactionService.loadTransactions();
    }
}
