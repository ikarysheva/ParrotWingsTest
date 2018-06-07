import { Component, OnInit, ViewChild, ContentChild, AfterViewInit, Inject, OnDestroy } from '@angular/core';
import { TransactionsService } from '../transactions.service';
import { Transaction } from '../../shared/models/transaction.model';
import { Observable, Subscription } from 'rxjs';
import { MatSort, MatTableDataSource, Sort, NativeDateAdapter, DateAdapter } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { DataTableService, DataTableSortingOrder } from '../../core/data-table/data-table.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})


export class TransactionListComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource = new MatTableDataSource<Transaction>([]);
  hasTransactions = true;

  private sortSubscription: Subscription;

  displayedColumns = ['date', 'username', 'amount', 'balance', 'repeat'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private transactionsService: TransactionsService,
    private router: Router,
    private route: ActivatedRoute,
    private dataTableService: DataTableService) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.transactionsService.getTransactions()
      .then((transactions: Transaction[]) => {

        this.hasTransactions = transactions.length > 0;
        this.dataSource.data = transactions.slice();
        if (this.sort.active) {
          this.sortTransactions();
        }
      });
  }

  ngAfterViewInit() {
    this.sortSubscription = this.sort.sortChange.subscribe(() => {
      this.sortTransactions();
    });
  }

  ngOnDestroy() {
    this.sortSubscription.unsubscribe();
  }

  private sortTransactions() {
    // console.log('sortChange1: ' + this.sort.active + ' ' + this.sort.direction);
    this.dataSource.data = this.dataTableService.sortData(this.dataSource.data, this.sort.active,
      this.sort.direction === 'asc' ? DataTableSortingOrder.Ascending : DataTableSortingOrder.Descending);
  }

  onRepeatTransaction(id: string) {
    this.router.navigate(['../create'], { relativeTo: this.route, queryParams: { 'repeat': id }, });
  }

  onCreateTransaction() {
    this.router.navigate(['../create'], { relativeTo: this.route });
  }

}

