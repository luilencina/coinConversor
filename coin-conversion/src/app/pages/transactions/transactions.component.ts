import { Component, inject, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Transaction, TransactionService } from '../../core/services/transaction.service';

import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { MatTableDataSource } from '@angular/material/table';
import { TransactionDetailDialogComponent } from './transaction-detail-dialog.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/components/alert/dialog.component';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    ButtonComponent
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionComponent implements OnInit, AfterViewInit, OnDestroy {
  private transactionService = inject(TransactionService);
  private dialog = inject(MatDialog);

  currencies = ['Ouro Real', 'Tibar'];
  displayedColumns: string[] = ['id', 'originCurrency', 'destinationCurrency', 'amount', 'date', 'actions'];
  dataSource = new MatTableDataSource<Transaction>([]);

  filterOrigin = '';
  filterDestination = '';

  filterStartDate: string = '';
  filterEndDate: string = '';

  filterMinAmount: number | null = null;
  filterMaxAmount: number | null = null;

  private transactionsSub?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource.filterPredicate = (data: Transaction, filter: string) => {
      const f = JSON.parse(filter);

      const matchOrigin = f.origin ? data.originCurrency.toLowerCase().includes(f.origin.toLowerCase()) : true;
      const matchDestination = f.destination ? data.destinationCurrency.toLowerCase().includes(f.destination.toLowerCase()) : true;

      const dataDate = this.convertTimestamp(data.date);
      let matchDate = true;

      if (f.startDate) {
        const startDate = new Date(f.startDate);
        matchDate = matchDate && dataDate >= startDate;
      }

      if (f.endDate) {
        const endDate = new Date(f.endDate);
        endDate.setHours(23, 59, 59, 999);
        matchDate = matchDate && dataDate <= endDate;
      }

      const matchMinAmount = f.minAmount != null ? data.amount >= f.minAmount : true;
      const matchMaxAmount = f.maxAmount != null ? data.amount <= f.maxAmount : true;

      return matchOrigin && matchDestination && matchDate && matchMinAmount && matchMaxAmount;
    };

    this.transactionsSub = this.transactionService.getTransactions().subscribe(transactions => {
      const sorted = this.sortTransactionsByDate(transactions);
      this.dataSource.paginator = this.paginator;
      this.dataSource.data = sorted;
      this.applyFilters();
    });
  }

  sortTransactionsByDate(transactions: Transaction[]): Transaction[] {
    return transactions.sort((a, b) => {
      const dateA = this.convertTimestamp(a.date)?.getTime() || 0;
      const dateB = this.convertTimestamp(b.date)?.getTime() || 0;

      return dateB - dateA;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.transactionsSub?.unsubscribe();
  }

  convertTimestamp(ts: any): Date {
    if (!ts) return new Date(0);

    if (ts.seconds !== undefined && ts.nanoseconds !== undefined) {
      return new Date(ts.seconds * 1000 + ts.nanoseconds / 1e6);
    }

    if (typeof ts === 'string' || ts instanceof Date) {
      return new Date(ts);
    }

    return new Date(0);
  }

  applyFilters() {
    const filterValue = {
      origin: this.filterOrigin,
      destination: this.filterDestination,
      startDate: this.filterStartDate,
      endDate: this.filterEndDate,
      minAmount: this.filterMinAmount,
      maxAmount: this.filterMaxAmount,
    };

    this.dataSource.filter = JSON.stringify(filterValue);
    this.dataSource.paginator = this.paginator;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  openDetails(transaction: Transaction) {
    this.dialog.open(TransactionDetailDialogComponent, {
      data: transaction,
      width: '400px'
    });
  }

  async deleteTransaction(id?: string) {
    if (!id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          title: 'Confirmação',
          bodyHtml: `<p>Tem certeza que deseja deletar a transação <strong>ID: ${id}</strong>?</p>`
        }
      });

      const confirmed = await dialogRef.afterClosed().toPromise();
      if (confirmed) {
        await this.transactionService.deleteTransaction(id);
      }
  }

}
