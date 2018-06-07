import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './core/main/main.component';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  {
    path: '', component: MainComponent, canActivate: [AuthGuard], children: [
      { path: 'transaction', loadChildren: './transactions/transactions.module#TransactionsModule' },
      { path: '', redirectTo: '/transaction', pathMatch: 'full' },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
