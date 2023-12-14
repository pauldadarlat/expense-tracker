import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from './user.model';
import { Expense } from './expense.model';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<User>({} as User);
  user$ = this.userSubject.asObservable();

  private today = new Date();
  private expenseList = [
    new Expense('1', 'categorie', 100, new Date()),
    new Expense('2', 'Groceries', 50, new Date(this.today)),
    new Expense('3',
      'Entertainment',
      30,
      new Date(this.today.getTime() - 2 * 24 * 60 * 60 * 1000)
    ),
    new Expense('4', 
      'Dining Out',
      25,
      new Date(this.today.getTime() - 1 * 24 * 60 * 60 * 1000)
    ),
    new Expense('5', 'Utilities', 80, new Date(this.today)),
    new Expense('6', 
      'Shopping',
      120,
      new Date(this.today.getTime() + 1 * 24 * 60 * 60 * 1000)
    ),
    new Expense('7', 
      'Transportation',
      40,
      new Date(this.today.getTime() + 2 * 24 * 60 * 60 * 1000)
    ),
    new Expense('8', 'Healthcare', 60, new Date(this.today)),
    new Expense('9', 
      'Entertainment',
      90,
      new Date(this.today.getTime() - 1 * 24 * 60 * 60 * 1000)
    ),
    new Expense('10', 
      'Travel',
      150,
      new Date(this.today.getTime() + 1 * 24 * 60 * 60 * 1000)
    ),
    new Expense('11', 
      'Entertainment',
      20,
      new Date(this.today.getTime() + 4 * 24 * 60 * 60 * 1000)
    ),
  ];
  private users: User[] = [
    new User('user123@email.com', 'user123', false, [], 200),
    new User('aaa@email.com', 'password' , false, this.expenseList, 1000),
  ];

  constructor() {}

  getUserById(userId: string): Observable<User | null> {
    return this.user$.pipe(
      map(() => {
        const foundUser = this.users.find((u) => u.id === userId);
        return foundUser ? { ...foundUser } : null;
      })
    );
  }

  getCurrentUser(): User {
    return this.userSubject.value;
  }

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  addExpense(expense: Expense): void {
    const currentUser = this.userSubject.value;
    const updatedExpenses = [...currentUser.pastExpenses, expense];
    const updatedUser: User = {
      ...currentUser,
      pastExpenses: updatedExpenses,
      spendingAmount: currentUser.spendingAmount,
    };
    this.setUser(updatedUser);
  }

  updateExpense(expenseId: string, updatedExpense: Expense): void {
    const currentUser = this.userSubject.value;
    const updatedExpenses = currentUser.pastExpenses.map(expense =>
      expense.id === expenseId ? updatedExpense : expense
    );
    const updatedUser: User = {
      ...currentUser,
      pastExpenses: updatedExpenses,
    };
    this.setUser(updatedUser);
  }
  

  deleteExpense(expenseId: string): void {
    const currentUser = this.userSubject.value;
    const updatedExpenses = currentUser.pastExpenses.filter(e => e.id !== expenseId);
    const updatedUser: User = {
      ...currentUser,
      pastExpenses: updatedExpenses,
    };
    this.setUser(updatedUser);
  }  

  updateSpendingAmount(newSpendingAmount: number): void {
    const currentUser = this.userSubject.value;
    const updatedUser: User = {
      ...currentUser,
      spendingAmount: newSpendingAmount,
    };
    this.setUser(updatedUser);
  }

  getPastExpenses(): Observable<Expense[]> {
    return this.user$.pipe(map((user) => user.pastExpenses));
  }

  getThisWeekExpenses(): Observable<Expense[]> {
    return this.user$.pipe(
      map((user) => {
        const today = new Date();
        const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
        const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });

        return user.pastExpenses.filter((expense) =>
          isWithinInterval(new Date(expense.date), {
            start: startOfWeekDate,
            end: endOfWeekDate,
          })
        );
      })
    );
  }

  getDailyExpenses(day: string): Observable<Expense[]> {
    return this.getThisWeekExpenses().pipe(
      map((expenses) =>
        expenses.filter(
          (expense) => this.formatDate(expense.date) === day.toLowerCase()
        )
      )
    );
  }

  getAmountForCurrentDay(day: string): Observable<number> {
    return this.getDailyExpenses(day).pipe(
      map((expenses) =>
        expenses.reduce((total, expense) => total + expense.amount, 0)
      )
    );
  }

  getAmountForCurrentWeek(): Observable<number> {
    return this.getThisWeekExpenses().pipe(
      map((expenses) =>
        expenses.reduce((total, expense) => total + expense.amount, 0)
      )
    );
  }

  formatDate(date: Date): string {
    const day = 'short' as const;
    const options = { weekday: day };
    return new Date(date).toLocaleDateString('en-US', options).toLowerCase();
  }
}
