import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionsService } from '../transactions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/user.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable, Subscription, Subject } from 'rxjs';
import { map, startWith, switchMap, pluck, takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { from } from 'rxjs';
import { MatDialog } from '@angular/material';
import { TransactionCompleteComponent } from '../transaction-complete/transaction-complete.component';
import { Transaction } from '../../shared/models/transaction.model';

@Component({
  selector: 'app-transaction-create',
  templateUrl: './transaction-create.component.html',
  styleUrls: ['./transaction-create.component.scss']
})
export class TransactionCreateComponent implements OnInit, OnDestroy {

  transactionForm: FormGroup;

  filteredUsers: Observable<any[]>;

  error: string;
  successMessage: string;

  submitted = false;

  private transaction: Transaction;

  private ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor(private transactionService: TransactionsService,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.route
      .queryParamMap
      .pipe(
        pluck('repeat'),
        switchMap(repeatId => this.transactionService.getTransactionById(+repeatId))
      )
      .subscribe(transaction => {
        this.transaction = transaction;
        this.initForm();
      });


    this.userService.balaceChanged.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((balance) => {
      const amount = this.amount;
      if (amount) {
        amount.clearValidators();
        amount.setValidators([Validators.required, this.amountLessThanBalance(this.userService.balance)]);
      }
    });
  }

  private initForm() {
    let username = '';
    let amount = '';
    if (this.transaction) {
      username = this.transaction.username;
      amount = Math.abs(this.transaction.amount) + '';
    }
    this.createForm(username, amount);
  }

  private createForm(username: string, amount: string) {
    this.transactionForm = this.fb.group({
      'username': [username, Validators.required],
      'amount': [amount, [Validators.required, this.amountLessThanBalance(this.userService.balance)]]
    });

    this.filteredUsers = this.username.valueChanges
      .pipe(
        startWith(''),
        distinctUntilChanged(),
        debounceTime(300),
        switchMap((name) => {
          if (name) {
            return this.filterUsername(name);
          }
          return from([]);
        }),
        takeUntil(this.ngUnsubscribe),
    );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  amountLessThanBalance(balance: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const amount = +control.value;
      return amount > balance ? { 'insufficientBalance': { value: control.value } } : null;
    };
  }

  onCreateTransaction() {
    this.submitted = true;
    return this.transactionService.createTransaction(this.username.value, this.amount.value)
      .subscribe(
        (data) => {
          this.openSuccessDialog();
        },
        err => {
          this.error = err;
          this.submitted = false;
        }
      );
  }

  openSuccessDialog(): void {
    const dialogRef = this.dialog.open(TransactionCompleteComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onCancel();
    });
  }


  onCancel() {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }

  get username() {
    return this.transactionForm ? this.transactionForm.get('username') : null;
  }

  get amount() {
    return this.transactionForm ? this.transactionForm.get('amount') : null;
  }

  filterUsername(name) {
    return this.userService.getUserList(name);
  }
}
