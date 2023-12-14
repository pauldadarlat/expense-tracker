import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Expense } from '../shared/expense.model';
import { UserService } from '../shared/user.service';
import { Subscription, Observable, map } from 'rxjs';

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
  dailyExpensesTotal$: Observable<number> | undefined;
  isEditing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.data.subscribe((data) => {
      const selectedDay = data['day'];
      if (!this.isValidDay(selectedDay)) {
        return alert('Invalid day!');
      }
      this.dateForDayOfWeek = this.getDateForDayOfWeek(selectedDay);

      this.userService
        .getDailyExpenses(selectedDay)
        .subscribe((expenses: Expense[]) => (this.expenseList = expenses));

      this.dailyExpensesTotal$ =
        this.userService.getAmountForCurrentDay(selectedDay);
    });

    this.selectedDay$ = this.route.data.pipe(map((data) => data['day']));
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  isValidDay(day: string): boolean {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.includes(day);
  }

  getTotalAmount(): Subscription | undefined {
    return this.selectedDay$?.subscribe((day) =>
      this.userService.getAmountForCurrentDay(day)
    );
  }

  openExpenseItemForm() {
    this.showExpenseItemForm = true;
    this.showAddExpenseButton = false;
    this.isEditing = false;
  }

  openEditExpense(expense: Expense): void {
    this.selectedExpense = expense;
    this.openExpenseItemForm();
    this.isEditing = true;
  }

  onSaveNewExpenseItem(newExpenseItem: Expense) {
    if (!this.isEditing) {
      newExpenseItem.date = this.dateForDayOfWeek;
      this.userService.addExpense(newExpenseItem);
    } else {
      const index = this.expenseList.indexOf(this.selectedExpense);
      if (index !== -1) {
        this.userService.updateExpense(this.selectedExpense.id, newExpenseItem);
      }
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
    return new Date(date).toLocaleDateString('en-US', options);
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
