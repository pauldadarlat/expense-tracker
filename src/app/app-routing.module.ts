import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'mon', component: ExpenseListComponent, data: { day: 'Mon' }, canActivate: [AuthGuard]  },
  { path: 'tue', component: ExpenseListComponent, data: { day: 'Tue' }, canActivate: [AuthGuard]  },
  { path: 'wed', component: ExpenseListComponent, data: { day: 'Wed' }, canActivate: [AuthGuard]  },
  { path: 'thu', component: ExpenseListComponent, data: { day: 'Thu' }, canActivate: [AuthGuard]  },
  { path: 'fri', component: ExpenseListComponent, data: { day: 'Fri' }, canActivate: [AuthGuard]  },
  { path: 'sat', component: ExpenseListComponent, data: { day: 'Sat' }, canActivate: [AuthGuard]  },
  { path: 'sun', component: ExpenseListComponent, data: { day: 'Sun' }, canActivate: [AuthGuard]  },
  { path: 'summary', component: SummaryComponent, canActivate: [AuthGuard]  },
  { path: '', redirectTo: '/user', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
