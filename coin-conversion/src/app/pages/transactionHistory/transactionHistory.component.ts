import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';

import {
  Transaction,
  TransactionService,
} from '../../core/services/transaction.service';
import { TransactionModalComponent } from '../../shared/components/transactionModal/moda-transaction.component';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  templateUrl: './transactionHistory.component.html',
  styleUrls: ['./transactionHistory.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
})
export class TransactionHistoryComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'id',
    'originCurrency',
    'destinationCurrency',
    'amount',
    'date',
  ];

  dataSource = new MatTableDataSource<Transaction>([]);

  currencies = ['Ouro Real', 'Tibar'];

  filterOrigin = '';
  filterDest = '';
  filterDate: Date | null = null;
  filterMinAmount: number | null = null;
  filterMaxAmount: number | null = null;

  private transactionService = inject(TransactionService);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadData(): void {
    this.dataSource.data = this.transactionService.getTransactions();
  }

  applyFilters(): void {
    const allData = this.transactionService.getTransactions();
    this.dataSource.data = allData.filter((t) => {
      const matchOrigin =
        !this.filterOrigin || t.originCurrency === this.filterOrigin;
      const matchDest =
        !this.filterDest || t.destinationCurrency === this.filterDest;
      const matchDate =
        !this.filterDate ||
        t.date.toDateString() === this.filterDate.toDateString();
      const matchMin =
        this.filterMinAmount == null || t.amount >= this.filterMinAmount;
      const matchMax =
        this.filterMaxAmount == null || t.amount <= this.filterMaxAmount;

      return matchOrigin && matchDest && matchDate && matchMin && matchMax;
    });
  }

  openDetails(row: Transaction): void {
    this.dialog.open(TransactionModalComponent, {
      data: {
        currentRate: row.amount,
        ...row,
      },
      width: '400px',
    });
  }
}
