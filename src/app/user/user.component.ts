import { Component } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Expense } from '../shared/expense.model';
import { AuthService } from '../auth/auth.service';
import { ExcelService } from '../shared/excel.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  user = this.userService.user$;
  pastExpenses: Expense[] = [];
  showPastExpensesList: boolean = false;
  newSpendingAmount: number | undefined;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private excelService: ExcelService
  ) {}

  updateSpendingAmount(): void {
    if (this.newSpendingAmount !== undefined) {
      this.userService.updateSpendingAmount(this.newSpendingAmount);
      this.newSpendingAmount = undefined;
    }
  }

  showPastExpenses(): void {
    this.userService.getPastExpenses().subscribe((pastExpenses) => {
      this.pastExpenses = pastExpenses;
      this.showPastExpensesList = true;
    });
  }

  formatDate(date: Date): string {
    const day = '2-digit' as const;
    const month = '2-digit' as const;
    const year = '2-digit' as const;

    const options = { day, month, year };
    return new Date(date).toLocaleDateString('en-US', options);
  }

  exportToExcel(): void {
    const pastExpenses = this.userService.getCurrentUser()?.pastExpenses || [];
    this.excelService.exportToExcel(pastExpenses, 'past_expenses');
  }

  logout(): void {
    this.authService.logout();
  }
}
