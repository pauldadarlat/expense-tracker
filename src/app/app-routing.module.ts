import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './auth/auth.guard';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const routes: Routes = [
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'summary', component: SummaryComponent, canActivate: [AuthGuard] },
  ...daysOfWeek.map((day) => ({
    path: day.toLowerCase(),
    component: ExpenseListComponent,
    data: { day: day },
    canActivate: [AuthGuard],
  })),
  { path: '', redirectTo: '/user', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
