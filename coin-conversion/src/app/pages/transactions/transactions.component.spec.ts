import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TransactionComponent } from './transactions.component';
import { TransactionService, Transaction } from '../../core/services/transaction.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';

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
      imports: [TransactionComponent, MatDialogModule],
      providers: [
        { provide: TransactionService, useClass: MockTransactionService },
        { provide: MatDialog, useClass: MockMatDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    transactionService = TestBed.inject(TransactionService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.dataSource.data.length).toBeGreaterThan(0);
  }));

  it('should apply filters and reset paginator', () => {
    spyOn(component.paginator, 'firstPage');
    component.filterOrigin = 'Ouro';
    component.applyFilters();
    expect(component.dataSource.filter).toContain('Ouro');
    expect(component.paginator.firstPage).toHaveBeenCalled();
  });

  it('should open details dialog', () => {
    spyOn(dialog, 'open').and.callThrough();
    const transaction = component.dataSource.data[0];
    component.openDetails(transaction);
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should delete transaction', async () => {
    spyOn(transactionService, 'deleteTransaction').and.callThrough();
    const id = component.dataSource.data[0].id!;
    await component.deleteTransaction(id);
    expect(transactionService.deleteTransaction).toHaveBeenCalledWith(id);
  });

  it('should not delete transaction if id is undefined', async () => {
    spyOn(transactionService, 'deleteTransaction');
    await component.deleteTransaction(undefined);
    expect(transactionService.deleteTransaction).not.toHaveBeenCalled();
  });

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
