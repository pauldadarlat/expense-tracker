import { Expense } from "./expense.model";

export class User {
    id: string;
    password: string;
    isLoggedIn: boolean;
    pastExpenses: Expense[];
    spendingAmount: number;

    constructor(id: string, password: string, isLoggedIn: boolean, pastExpenses: Expense[], spendingAmount: number ){
        this.id=id;
        this.password = password;
        this.isLoggedIn = isLoggedIn;
        this. pastExpenses = pastExpenses;
        this.spendingAmount = spendingAmount;
    }
  }

export interface User {
    id: string;
    password: string;
    isLoggedIn: boolean;
    pastExpenses: Expense[];
    spendingAmount: number;
  }
  