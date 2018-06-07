import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  userName: string;
  balance: number;

  private balanceSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(private userService: UserService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.userSubscription = this.userService.curentUserChanged.subscribe((data: User) => {
      this.userName = data.name;
      this.balance = data.balance;
    });
    this.balanceSubscription = this.userService.balaceChanged.subscribe((balance: number) => {
      this.balance = balance;
    });
    this.userService.getUserInfo();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }

  ngOnDestroy() {
    this.balanceSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }



}
