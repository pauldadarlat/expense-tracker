import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Expense } from '../shared/expense.model';
import { UserService } from '../shared/user.service';
import { Subscription, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  expenseList: Expense[] = [];
  showAddExpenseButton: boolean = true;
  selectedDay$: Observable<string> | undefined;
  private dateForDayOfWeek: Date = new Date();
  showExpenseItemForm: boolean = false;
  selectedExpense!: Expense;
  private routeSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();
  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userSubscription = this.userService
      .getCurrentUser()
      .subscribe((user) => {
        if (user) {
          this.routeSubscription = this.route.data
            .pipe(
              map((data) => data['day']),
              switchMap((selectedDay) => {
                if (!selectedDay || !this.isValidDay(selectedDay)) {
                  alert('Invalid day!' + selectedDay);
                  return of(void 0);
                }
                this.dateForDayOfWeek = this.getDateForDayOfWeek(selectedDay);

                return this.userService.getDailyExpenses(selectedDay);
              })
            )
            .subscribe((expenses: Expense[] | void) => {
              if (expenses) {
                this.expenseList = expenses;
                this.showAddExpenseButton = true;
              }
            });
          this.selectedDay$ = this.route.data.pipe(map((data) => data['day']));
        }
      });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  isValidDay(day: string): boolean {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.includes(day);
  }

  calculateDailyExpensesTotal(): number {
    return this.expenseList.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  }

  openExpenseItemForm() {
    this.showExpenseItemForm = true;
    this.showAddExpenseButton = false;
  }

  openEditExpense(expense: Expense): void {
    this.selectedExpense = expense;
    this.openExpenseItemForm();
  }

  onSaveNewExpenseItem(newExpenseItem: Expense) {
    if (!this.selectedExpense) {
      newExpenseItem.date = this.dateForDayOfWeek;
      this.userService.addExpense(newExpenseItem);
    } else {
      this.userService.updateExpense(this.selectedExpense.id, newExpenseItem);
    }

    this.closeExpenseItemForm();
  }

  closeExpenseItemForm() {
    this.showExpenseItemForm = false;
    this.showAddExpenseButton = true;
  }

  deleteExpense(expense: Expense): void {
    this.userService.deleteExpense(expense.id);
  }

  formatDate(date: Date): string {
    const day = '2-digit' as const;
    const month = '2-digit' as const;
    const year = '2-digit' as const;
    const options = { day, month, year };
    return date.toLocaleDateString('en-US', options);
  }

  getDateForDayOfWeek(dayOfWeek: string): Date {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const inputDayIndex = daysOfWeek.indexOf(dayOfWeek);
    const dayDifference = inputDayIndex - currentDayOfWeek;
    const dateForDayOfWeek = new Date(currentDate);
    dateForDayOfWeek.setDate(currentDate.getDate() + dayDifference);
    return dateForDayOfWeek;
  }
}
