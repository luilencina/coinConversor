import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { TransactionService, Transaction } from '../../core/services/transaction.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ConfirmDialogComponent } from '../../shared/components/alert/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

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
    ConfirmDialogComponent,
    ButtonComponent
  ],
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.scss']
})
export class ConversionComponent implements OnInit {
  private dialog = inject(MatDialog);

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

  if (this.amount < 0) {
    await this.showAlert('O valor não pode ser negativo.');
    this.convertedValue = null;
    return;
  }

  if (this.originCurrency === this.destinationCurrency) {
    this.convertedValue = this.amount;
    await this.showAlert('Moeda de origem e destino são iguais. Valor mantido.');
    return;
  }

  this.convertedValue =
    this.originCurrency === 'Ouro Real' ? this.amount * rate : this.amount / rate;

  const transaction: Transaction = {
    originCurrency: this.originCurrency,
    destinationCurrency: this.destinationCurrency,
    amount: this.convertedValue,
    date: new Date(),
  };

  try {
    await this.transactionService.addTransaction(transaction);
    await this.showAlert('Transação salva com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar transação:', error);
    await this.showAlert('Erro ao salvar transação.');
  }
  }
  async showAlert(message: string) {
    await firstValueFrom(
      this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          title: 'Aviso',
          bodyText: message,
          onlyCloseButton: true,
        },
      }).afterClosed()
    );
  }

}
