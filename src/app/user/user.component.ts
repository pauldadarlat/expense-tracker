import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Expense } from '../shared/expense.model';
import { AuthService } from '../auth/auth.service';
import { ExcelService } from '../shared/excel.service';
import { from } from 'rxjs';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  user: User | null = null;
  pastExpenses: Expense[] = [];
  showPastExpensesList: boolean = false;
  newSpendingAmount: number | undefined;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  updateSpendingAmount(): void {
    if (this.newSpendingAmount !== undefined && this.user) {
      this.userService.updateSpendingAmount(this.newSpendingAmount);
      this.newSpendingAmount = undefined;
    }
  }

  showPastExpenses(): void {
    if(!this.showPastExpensesList)
    this.userService.getPastExpenses().subscribe((pastExpenses) => {
      this.pastExpenses = pastExpenses;
      this.showPastExpensesList = true;
    });
    else
      this.showPastExpensesList = false;
  }

  formatDate(date: Date): string {
    const day = '2-digit' as const;
    const month = '2-digit' as const;
    const year = '2-digit' as const;

    const options = { day, month, year };
    return new Date(date).toLocaleDateString('en-US', options);
  }

  exportToExcel(): void {
    if (this.user) {
      const pastExpenses = this.user.pastExpenses || [];
      this.excelService.exportToExcel(pastExpenses, 'past_expenses');
    }
  }

  logout(): void {
    from(this.authService.logout()).subscribe();
  }
}
