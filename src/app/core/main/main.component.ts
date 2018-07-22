import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  userName: string;
  balance: number;

  private ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor(private userService: UserService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.userService.curentUserChanged.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((data: User) => {
      this.userName = data.name;
      this.balance = data.balance;
    });
    this.userService.balaceChanged.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((balance: number) => {
      this.balance = balance;
    });
    this.userService.getUserInfo();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
