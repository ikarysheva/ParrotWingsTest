import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionsService } from '../transactions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/user.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
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

  private repeatId: number;

  private balanceSubscription: Subscription;


  constructor(private transactionService: TransactionsService,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.route
      .queryParamMap
      .pipe(map(params => params.get('repeat') || null))
      .subscribe(id => {
        this.repeatId = +id;
        this.initForm();
      });


    this.balanceSubscription = this.userService.balaceChanged.subscribe((balance) => {
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
    if (this.repeatId) {
      this.transactionService.getTransactionById(this.repeatId).then((transaction) => {
        if (transaction) {
          username = transaction.username;
          amount = Math.abs(transaction.amount) + '';
        }
        this.createForm(username, amount);
      });
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
        switchMap((name) => {
          if (name) {
            return this.filterUsername(name);
          }
          return from([]);
        })
      );
  }

  ngOnDestroy() {
    this.balanceSubscription.unsubscribe();
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
