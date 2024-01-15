import { Expense } from "./expense.model";

export class User {
    id: string;
    // email: string;
    // password: string;
    // isLoggedIn: boolean;
    pastExpenses: Expense[];
    spendingAmount: number;

    constructor(id: string, /*email:string, password: string, isLoggedIn: boolean,*/ pastExpenses: Expense[], spendingAmount: number ){
        this.id=id;
        // this.email = email;
        // this.password = password;
        // this.isLoggedIn = isLoggedIn;
        this. pastExpenses = pastExpenses;
        this.spendingAmount = spendingAmount;
    }
  }
