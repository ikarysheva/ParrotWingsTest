import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '../auth/auth.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MainComponent } from './main/main.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AppRoutingModule } from '../app-routing.module';
import { AuthInterceptor } from '../shared/auth.interceptor';
import { UserService } from './user.service';
import { TransactionsService } from '../transactions/transactions.service';
import { DATA_TABLE_PROVIDER } from './data-table/data-table.service';
import { DateAdapter, NativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { Platform } from '@angular/cdk/platform';
import { CustomDateAdapter } from './custom.dateadapter';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    AuthModule,
    SharedModule,
    AppRoutingModule,
    HttpClientModule
  ],
  exports: [
    AppRoutingModule
  ],
  declarations: [MainComponent],
  providers: [
    AuthGuard,
    AuthService,
    UserService,
    TransactionsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE] },
    DATA_TABLE_PROVIDER
  ]
})
export class CoreModule { }
