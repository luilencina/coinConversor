import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { TransactionService, Transaction } from '../../core/services/transaction.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-conversion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ButtonComponent
  ],
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.scss']
})
export class ConversionComponent implements OnInit {
  currencies = ['Ouro Real', 'Tibar'];

  originCurrency = 'Ouro Real';
  destinationCurrency = 'Tibar';
  amount: number | null = null;
  convertedValue: number | null = null;

  lastTransactionValue: number | null = null;

  constructor(
    private exchangeRate: ExchangeRateService,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    this.transactionService.getTransactions().subscribe({
      next: (transactions: Transaction[]) => {
        if (transactions.length > 0) {
          transactions.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          this.lastTransactionValue = transactions[0].amount;
        }
      },
      error: (error) => {
        console.error('Erro ao buscar transações:', error);
      }
    });
  }

  async convert() {
    const rate = this.exchangeRate.getRate();

    if (this.amount == null || !this.originCurrency || !this.destinationCurrency) {
      this.convertedValue = null;
      return;
    }

    this.convertedValue =
      this.originCurrency === 'Ouro Real'
        ? this.amount * rate
        : this.amount / rate;

    const transaction: Transaction = {
      originCurrency: this.originCurrency,
      destinationCurrency: this.destinationCurrency,
      amount: this.convertedValue,
      date: new Date(),
    };

    try {
      await this.transactionService.addTransaction(transaction);
      alert('Transação salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      alert('Erro ao salvar transação.');
    }
  }
}
