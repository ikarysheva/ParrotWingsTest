import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionCreateComponent } from './transaction-create/transaction-create.component';
import { SharedModule } from '../shared/shared.module';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionCompleteComponent } from './transaction-complete/transaction-complete.component';
import { TransactionComponent } from './transaction.component';

@NgModule({
  imports: [
    SharedModule,
    TransactionsRoutingModule
  ],
  declarations: [TransactionListComponent, TransactionCreateComponent, TransactionCompleteComponent, TransactionComponent],
  entryComponents: [TransactionCompleteComponent]
})
export class TransactionsModule { }
