import { Component, OnInit } from '@angular/core';
import { Expense } from '../shared/expense.model';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  weekDays: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  weeklyTotal: number = 0;
  dailyExpenses: Expense[] = [];
  weeklyExpenses: Expense[] = [];
  user: User = {
    id: '',
    pastExpenses: [],
    spendingAmount: 0,
  };
  weeklySavings: number = 0;
  chartData: any[] = [];
  chartLabels: string[] = [];
  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
  };
  chartColors: any[] = [
    {
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#007BFF', '#6610F2', '#6F42C1', '#28A745', '#DC3545', '#17A2B8'],
    },
  ];
  showChart: boolean = false;
  private userSubscription: Subscription = new Subscription();
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
        this.userService.getThisWeekExpenses().subscribe((expenses) => {
          this.weeklyExpenses = expenses.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
          });
        
          this.weekDays = this.getDaysWithExpenses();
        });
        
        this.userService.getAmountForCurrentWeek().subscribe((amount) => {
          this.weeklyTotal = amount;
          this.calculateWeeklySavings();
        });
      } else {
        console.log('User is null.');
      }
    });
  }

  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }

  getDaysWithExpenses(): string[] {
    const daysWithExpenses: string[] = [];
    this.weeklyExpenses.forEach((expense) => {
      const day = this.formatDate(expense.date);
      if (!daysWithExpenses.includes(day)) {
        daysWithExpenses.push(day);
      }
    });
    return daysWithExpenses.sort((a, b) => this.weekDays.indexOf(a) - this.weekDays.indexOf(b));
  }
  
  getExpensesForDay(day: string): Expense[] {
    return this.weeklyExpenses.filter((expense) => {
      try {
        const expenseDate = expense.date;
        const formattedDate = this.formatDate(expenseDate);
        return formattedDate.toLowerCase() === day.toLowerCase();
      } catch (error) {
        console.error('Error:', error);
        return false;
      }
    });
  }

  formatDate(date: Date): string {
    const options = { weekday: 'long' as const };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  calculateWeeklySavings(): void {
    if (this.user && this.user.spendingAmount) {
      this.weeklySavings = this.user.spendingAmount - this.weeklyTotal;
    }
  }

  getChartData(): any[] {
    const eachCategory: { [category: string]: number } = {};
    this.weeklyExpenses.forEach((expense: Expense) => {
      const category = expense.category;
      const amount = expense.amount;
      if (eachCategory[category]) {
        eachCategory[category] += amount;
      } else {
        eachCategory[category] = amount;
      }
    });

    const chartData = Object.keys(eachCategory).map((category) => ({
      category,
      amount: eachCategory[category],
    }));
    return chartData || [];
  }

  toggleChartVisibility(): void {
    this.showChart = !this.showChart;
    if (this.showChart) {
      this.chartData = this.getChartData();
    }
  }
}
