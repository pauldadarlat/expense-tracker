import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap} from 'rxjs';
import { User } from './user.model';
import { Expense } from './expense.model';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private expenseList = [
  //   new Expense('1', 'categorie', 100, new Date()),
  //   new Expense('2', 'Groceries', 50, new Date(this.today)),
  //   new Expense('3',
  //     'Entertainment',
  //     30,
  //     new Date(this.today.getTime() - 2 * 24 * 60 * 60 * 1000)
  //   ),
  //   new Expense('4',
  //     'Dining Out',
  //     25,
  //     new Date(this.today.getTime() - 1 * 24 * 60 * 60 * 1000)
  //   ),
  //   new Expense('5', 'Utilities', 80, new Date(this.today)),
  //   new Expense('6',
  //     'Shopping',
  //     120,
  //     new Date(this.today.getTime() + 1 * 24 * 60 * 60 * 1000)
  //   ),
  //   new Expense('7',
  //     'Transportation',
  //     40,
  //     new Date(this.today.getTime() + 2 * 24 * 60 * 60 * 1000)
  //   ),
  //   new Expense('8', 'Healthcare', 60, new Date(this.today)),
  //   new Expense('9',
  //     'Entertainment',
  //     90,
  //     new Date(this.today.getTime() - 1 * 24 * 60 * 60 * 1000)
  //   ),
  //   new Expense('10',
  //     'Travel',
  //     150,
  //     new Date(this.today.getTime() + 1 * 24 * 60 * 60 * 1000)
  //   ),
  //   new Expense('11',
  //     'Entertainment',
  //     20,
  //     new Date(this.today.getTime() + 4 * 24 * 60 * 60 * 1000)
  //   ),
  // ];
  // private users: User[] = [
  //   new User('12asd','user123@email.com', 'user123', false, [], 200),
  //   new User('23asd', 'aaa@email.com', 'password' , false, this.expenseList, 1000),
  // ];

  private _isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isLoggedIn$ = this._isLoggedIn.asObservable();
  private userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState
      .pipe(
        switchMap((authUser) => {
          if (authUser) {
            const userId = authUser.uid;
            return this.firestore
              .doc<User>(`users/${userId}`)
              .valueChanges()
              .pipe(
                switchMap((user) => {
                  if (user) {
                    this.userSubject.next(user);
                  } else {
                    this.userSubject.next(null);
                  }
                  return user ? of(user) : of(null);
                })
              );
          } else {
            return of(null);
          }
        })
      )
      .subscribe((user) => {
        this._isLoggedIn.next(!!user);
      });
  }

  getUserById(userId: string): Observable<User | null> {
    return this.firestore
      .doc<User>(`users/${userId}`)
      .valueChanges()
      .pipe(map((user) => (user ? { ...user } : null)));
  }

  getCurrentUser(): Observable<User | null> {
    return this.afAuth.authState.pipe(
      switchMap((authUser) => {
        if (authUser) {
          const userId = authUser.uid;
          return this.firestore
            .doc<User>(`users/${userId}`)
            .valueChanges() as Observable<User | null>;
        } else {
          return of(null) as Observable<User | null>;
        }
      })
    );
  }

  setUser(user: User | null): void {
    if (user) {
      this.userSubject.next(user);
    } else {
      this.userSubject.next(null);
    }
  }

  addExpense(expense: Expense): void {
    const userId = this.userSubject.value?.id;
    if (userId) {
      const userRef = this.firestore.doc(`users/${userId}`);
      const pastExpenses = this.userSubject.value?.pastExpenses || [];
      const expenseWithDateString = {
        ...expense,
        date: expense.date.toString(),
      };
      const updatedExpenses = [...pastExpenses, expenseWithDateString];
      userRef
        .update({ pastExpenses: updatedExpenses })
        .then(() => {
          console.log('Expense added successfully.');
        })
        .catch((error) => {
          console.error('Error adding expense:', error);
        });
    }
  }

  updateExpense(expenseId: string, updatedExpense: Expense): void {
    const userId = this.userSubject.value?.id;
    if (userId) {
      const userRef = this.firestore.doc(`users/${userId}`);
      const pastExpenses = this.userSubject.value?.pastExpenses || [];
      const expenseIndex = pastExpenses.findIndex(expense => expense.id === expenseId);
  
      if (expenseIndex !== -1) {
        const updatedExpenses = pastExpenses.map(expense => {
          if (expense.id === expenseId) {
            return {
              id: expense.id || '',
              amount: updatedExpense.amount || 0,
              category: updatedExpense.category || '',
              date: updatedExpense.date instanceof Date ? updatedExpense.date.toString() : updatedExpense.date,
            };
          } else {
            return expense;
          }
        });
  
        userRef
          .update({ pastExpenses: updatedExpenses })
          .then(() => {
            console.log('Expense updated successfully.');
          })
          .catch((error) => {
            console.error('Error updating expense:', error);
          });
      } else {
        console.error('Expense with the specified ID not found.');
      }
    }
  }
  
  deleteExpense(expenseId: string): void {
    const userId = this.userSubject.value?.id;
    if (userId) {
      const userRef = this.firestore.doc(`users/${userId}`);
      const pastExpenses = this.userSubject.value?.pastExpenses || [];
      const expenseIndex = pastExpenses.findIndex(expense => expense.id === expenseId);
      if (expenseIndex !== -1) {
        const updatedExpenses = pastExpenses.filter(expense => expense.id !== expenseId);
        userRef
          .update({ pastExpenses: updatedExpenses })
          .then(() => {
            console.log('Expense deleted successfully.');
          })
          .catch((error) => {
            console.error('Error deleting expense:', error);
          });
      } else {
        console.error('Expense with the specified ID not found.');
      }
    }
  }
  

  updateSpendingAmount(newSpendingAmount: number): void {
    const userId = this.userSubject.value?.id;
    if (userId) {
      this.firestore
        .doc(`users/${userId}`)
        .update({ spendingAmount: newSpendingAmount });
    }
  }

  getPastExpenses(): Observable<Expense[]> {
    const userId = this.userSubject.value?.id;
    if (userId) {
      const pastExpenses = this.userSubject.value?.pastExpenses || [];
      const allPastExpenses = pastExpenses.map((expense) => {
        if (expense.date) {
          const expenseDate = new Date(expense.date);
          const mappedExpense: Expense = {
            id: expense.id || '',
            amount: expense.amount || 0,
            category: expense.category || '',
            date: expenseDate,
          };
          return mappedExpense;
        }
        return expense;
      });
      return of(allPastExpenses);
    }
    return of([]);
  }

  getThisWeekExpenses(): Observable<Expense[]> {
    const userId = this.userSubject.value?.id;
    if (userId) {
      const today = new Date();
      const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
      const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });
      const pastExpenses = this.userSubject.value?.pastExpenses || [];
      const thisWeekExpenses = pastExpenses
        .map((expense) => {
          if (expense.date) {
            const expenseDate = new Date(expense.date);
            const mappedExpense: Expense = {
              id: expense.id || '',
              amount: expense.amount || 0,
              category: expense.category || '',
              date: expenseDate,
            };
            return mappedExpense;
          }
          return expense;
        })
        .filter((expense) => {
          if (expense.date) {
            return isWithinInterval(expense.date, {
              start: startOfWeekDate,
              end: endOfWeekDate,
            });
          }
          return false;
        });
      return of(thisWeekExpenses);
    }
    return of([]);
  }

  getDailyExpenses(day: string): Observable<Expense[]> {
    return this.getThisWeekExpenses().pipe(
      map((expenses) => {
        const dailyExpenses = expenses.filter((expense) => {
          const formattedDate = this.formatDate(expense.date);
          return formattedDate === day.toLowerCase();
        });
        return dailyExpenses;
      })
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
    // console.log('formatDate: ' + date + 'altck: ' + new Date(date));

    return new Date(date).toLocaleDateString('en-US', options).toLowerCase();
  }
}
