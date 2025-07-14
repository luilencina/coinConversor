import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TransactionComponent } from './transactions.component';
import { TransactionService, Transaction } from '../../core/services/transaction.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TransactionDetailDialogComponent } from './transaction-detail-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'zone.js'

class MockTransactionService {
  private transactions: Transaction[] = [
    { id: '1', originCurrency: 'Ouro Real', destinationCurrency: 'Tibar', amount: 100, date: new Date() }
  ];

  getTransactions() {
    return of(this.transactions);
  }

  deleteTransaction(id: string) {
    this.transactions = this.transactions.filter(t => t.id !== id);
    return Promise.resolve();
  }
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(null)
    };
  }
}

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;
  let transactionService: TransactionService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TransactionComponent,
        TransactionDetailDialogComponent,
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
        ButtonComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TransactionService, useClass: MockTransactionService },
        { provide: MatDialog, useClass: MockMatDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService);
    dialog = TestBed.inject(MatDialog);

    // Mock paginator necessário para o componente
    component.paginator = {
      firstPage: jasmine.createSpy('firstPage')
    } as unknown as MatPaginator;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions on init', fakeAsync(() => {
    tick();
    expect(component.dataSource.data.length).toBeGreaterThan(0);
  }));

  it('should apply filters and reset paginator', () => {
    component.filterOrigin = 'Ouro';
    component.applyFilters();
    expect(component.dataSource.filter).toContain('Ouro');
    expect(component.paginator.firstPage).toHaveBeenCalled();
  });

  it('should open details dialog', () => {
    spyOn(dialog, 'open').and.callThrough();
    const transaction = component.dataSource.data[0];
    component.openDetails(transaction);
    expect(dialog.open).toHaveBeenCalledWith(TransactionDetailDialogComponent, jasmine.objectContaining({
      data: transaction,
      width: '400px'
    }));
  });

  it('should delete transaction', fakeAsync(async () => {
    spyOn(transactionService, 'deleteTransaction').and.callThrough();
    const id = component.dataSource.data[0].id!;
    await component.deleteTransaction(id);
    expect(transactionService.deleteTransaction).toHaveBeenCalledWith(id);
  }));

  it('should not delete transaction if id is undefined', fakeAsync(async () => {
    spyOn(transactionService, 'deleteTransaction');
    await component.deleteTransaction(undefined as any);
    expect(transactionService.deleteTransaction).not.toHaveBeenCalled();
  }));

  it('convertTimestamp should convert correctly', () => {
    const ts1 = { seconds: 1638316800, nanoseconds: 0 };
    const date1 = component.convertTimestamp(ts1);
    expect(date1).toEqual(new Date(1638316800 * 1000));

    const dateStr = '2023-01-01T00:00:00Z';
    const date2 = component.convertTimestamp(dateStr);
    expect(date2).toEqual(new Date(dateStr));

    const dateObj = new Date();
    expect(component.convertTimestamp(dateObj)).toEqual(dateObj);

    expect(component.convertTimestamp(null)).toBeNull();
    expect(component.convertTimestamp({})).toBeNull();
  });
});
