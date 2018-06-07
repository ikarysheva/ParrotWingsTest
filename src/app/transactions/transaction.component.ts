import { Component, OnInit } from '@angular/core';
import { TransactionsModule } from './transactions.module';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.router.navigate(['list'], { relativeTo: this.route });
  }

}
