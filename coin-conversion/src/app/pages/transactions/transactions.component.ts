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
import { Subscription } from 'rxjs';

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

  displayedColumns: string[] = ['id', 'originCurrency', 'destinationCurrency', 'amount', 'date', 'actions'];
  dataSource = new MatTableDataSource<Transaction>([]);

  filterOrigin = '';
  filterDestination = '';
  filterDate: string = '';
  filterMinAmount: number | null = null;
  filterMaxAmount: number | null = null;

  private transactionsSub?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource.filterPredicate = (data: Transaction, filter: string) => {
      const f = JSON.parse(filter);

      const matchOrigin = f.origin ? data.originCurrency.toLowerCase().includes(f.origin.toLowerCase()) : true;
      const matchDestination = f.destination ? data.destinationCurrency.toLowerCase().includes(f.destination.toLowerCase()) : true;

      const dataDate = this.convertTimestamp(data.date)?.toISOString().slice(0, 10);
      const matchDate = f.date ? dataDate === f.date : true;

      const matchMinAmount = f.minAmount != null ? data.amount >= f.minAmount : true;
      const matchMaxAmount = f.maxAmount != null ? data.amount <= f.maxAmount : true;

      return matchOrigin && matchDestination && matchDate && matchMinAmount && matchMaxAmount;
    };

    this.transactionsSub = this.transactionService.getTransactions().subscribe(transactions => {
      this.dataSource.paginator = this.paginator; 
      this.dataSource.data = transactions;
      this.applyFilters(); 
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.transactionsSub?.unsubscribe(); 
  }

  convertTimestamp(ts: any): Date | null {
    if (!ts) return null;

    if (ts.seconds !== undefined && ts.nanoseconds !== undefined) {
      return new Date(ts.seconds * 1000 + ts.nanoseconds / 1e6);
    }

    if (typeof ts === 'string' || ts instanceof Date) {
      return new Date(ts);
    }

    return null;
  }

  applyFilters() {
    const filterValue = {
      origin: this.filterOrigin,
      destination: this.filterDestination,
      date: this.filterDate,
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
    await this.transactionService.deleteTransaction(id);
  }
}
