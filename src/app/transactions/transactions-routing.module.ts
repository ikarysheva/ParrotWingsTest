import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionCreateComponent } from './transaction-create/transaction-create.component';
import { TransactionComponent } from './transaction.component';
import { TransactionResolver } from './transaction.resolver';

const routes: Routes = [
  {
    path: '', component: TransactionComponent, data: { title: 'Transactions' },
    resolve: { transactions: TransactionResolver }, pathMatch: 'prefix', children: [
      { path: 'list', component: TransactionListComponent, data: { title: 'List of transactions' } },
      { path: 'create', component: TransactionCreateComponent, data: { title: 'Create new transaction' } },
      // { path: '', redirectTo: 'list', pathMatch: 'full' },
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [TransactionResolver]
})
export class TransactionsRoutingModule { }
