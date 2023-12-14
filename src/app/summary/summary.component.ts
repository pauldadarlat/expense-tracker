import { Component, OnInit } from '@angular/core';
import { Expense } from '../shared/expense.model';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';

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
  user: User | undefined;
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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();

    this.userService.getThisWeekExpenses().subscribe((expenses) => {
      this.weeklyExpenses = expenses;
    });

    this.userService.getAmountForCurrentWeek().subscribe((amount) => {
      this.weeklyTotal = amount;
      this.calculateWeeklySavings();
    });
  }

  getDailyExpenses(day: string): Expense[] {
    return this.weeklyExpenses.filter((expense) => this.formatDate(expense.date) === day.toLowerCase());
  }

  formatDate(date: Date): string {
    const day = 'short' as const;
    const options = { weekday: day };
    return new Date(date).toLocaleDateString('en-US', options).toLowerCase();
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
