import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Expense } from 'src/app/shared/expense.model';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css'],
})
export class ExpenseItemComponent {
  categories: string[] = [
    'Groceries',
    'Entertainment',
    'Dining Out',
    'Utilities',
    'Shopping',
    'Transportation',
    'Healthcare',
    'Education',
    'Travel',
    'Miscellaneous',
    'Housing',
    'Insurance',
    'Fitness',
    'Electronics',
    'Gifts & Donations',
  ];
  @Input() expenseItem!: Expense;
  @Output() saveExpenseItem = new EventEmitter<Expense>();
  @Output() cancel = new EventEmitter<void>();

  selectedCategory: string | undefined;
  amount: number | undefined;
  date: Date = new Date();
  id: string = uuidv4();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenseItem'] && changes['expenseItem'].currentValue) {
      this.selectedCategory = this.expenseItem.category;
      this.amount = this.expenseItem.amount;
      this.date = this.expenseItem.date;
    }
  }

  onSubmit() {
    if (
      this.selectedCategory !== undefined &&
      this.amount !== undefined &&
      this.date !== undefined
    ) {
      const newExpenseItem: Expense = {
        id: this.id,
        category: this.selectedCategory,
        amount: this.amount,
        date: this.date,
      };
      this.saveExpenseItem.emit(newExpenseItem);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
