// src/app/core/services/transaction.service.ts
import { Injectable } from '@angular/core';

export interface Transaction {
  id: number;
  originCurrency: string;
  destinationCurrency: string;
  amount: number;
  date: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private mockData: Transaction[] = [];

  constructor() {
    for (let i = 1; i <= 150; i++) {
      this.mockData.push({
        id: i,
        originCurrency: i % 2 === 0 ? 'Ouro Real' : 'Tibar',
        destinationCurrency: i % 2 === 0 ? 'Tibar' : 'Ouro Real',
        amount: +(Math.random() * 1000).toFixed(2),
        date: this.randomDate(),
      });
    }
  }

  getTransactions(): Transaction[] {
    return this.mockData;
  }

  private randomDate(): Date {
    const start = new Date(2023, 0, 1).getTime();
    const end = new Date().getTime();
    return new Date(start + Math.random() * (end - start));
  }

 


}
