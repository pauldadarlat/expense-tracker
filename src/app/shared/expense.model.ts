export class Expense {
  id: string;
  category: string;
  amount: number;
  date: Date;

  constructor(id: string, category: string, amount: number, date: Date) {
    this.id = id;
    this.category = category;
    this.amount = amount;
    this.date = date;
  }
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: Date;
}
