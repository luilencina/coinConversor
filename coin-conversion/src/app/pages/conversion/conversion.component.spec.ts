import 'zone.js/testing';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ConversionComponent } from './conversion.component';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { TransactionService, Transaction } from '../../core/services/transaction.service';
import { of, throwError } from 'rxjs';

class MockExchangeRateService {
  getRate() {
    return 2;
  }
}

class MockTransactionService {
  private transactions: Transaction[] = [
    { originCurrency: 'Ouro Real', destinationCurrency: 'Tibar', amount: 100, date: new Date('2023-01-01') }
  ];

  getTransactions() {
    return of(this.transactions);
  }

  addTransaction(transaction: Transaction) {
    this.transactions.push(transaction);
    return Promise.resolve();
  }
}

describe('ConversionComponent', () => {
  let component: ConversionComponent;
  let fixture: ComponentFixture<ConversionComponent>;
  let exchangeRateService: ExchangeRateService;
  let transactionService: TransactionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConversionComponent],
      providers: [
        { provide: ExchangeRateService, useClass: MockExchangeRateService },
        { provide: TransactionService, useClass: MockTransactionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConversionComponent);
    component = fixture.componentInstance;
    exchangeRateService = TestBed.inject(ExchangeRateService);
    transactionService = TestBed.inject(TransactionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set lastTransactionValue on ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.lastTransactionValue).toBe(100);
  }));

  it('should set lastTransactionValue on ngOnInit', waitForAsync(() => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
    expect(component.lastTransactionValue).toBe(100);
    });
    }));

  it('should convert amount correctly when originCurrency is Ouro Real', async () => {
    component.amount = 10;
    component.originCurrency = 'Ouro Real';
    component.destinationCurrency = 'Tibar';

    spyOn(window, 'alert');

    await component.convert();

    expect(component.convertedValue).toBe(20);
    expect(window.alert).toHaveBeenCalledWith('Transação salva com sucesso!');
  });

  it('should convert amount correctly when originCurrency is not Ouro Real', async () => {
    component.amount = 20;
    component.originCurrency = 'Tibar';
    component.destinationCurrency = 'Ouro Real';

    spyOn(window, 'alert');

    await component.convert();

    expect(component.convertedValue).toBe(10);
    expect(window.alert).toHaveBeenCalledWith('Transação salva com sucesso!');
  });

  it('should set convertedValue to null if amount is null or currencies missing', async () => {
    component.amount = null;
    component.originCurrency = 'Ouro Real';
    component.destinationCurrency = 'Tibar';

    await component.convert();
    expect(component.convertedValue).toBeNull();

    component.amount = 10;
    component.originCurrency = '';
    component.destinationCurrency = 'Tibar';

    await component.convert();
    expect(component.convertedValue).toBeNull();

    component.amount = 10;
    component.originCurrency = 'Ouro Real';
    component.destinationCurrency = '';

    await component.convert();
    expect(component.convertedValue).toBeNull();
  });

  it('should handle error when addTransaction fails', async () => {
    spyOn(transactionService, 'addTransaction').and.returnValue(Promise.reject('error'));
    spyOn(console, 'error');
    spyOn(window, 'alert');

    component.amount = 10;
    component.originCurrency = 'Ouro Real';
    component.destinationCurrency = 'Tibar';

    await component.convert();

    expect(console.error).toHaveBeenCalledWith('Erro ao salvar transação:', 'error');
    expect(window.alert).toHaveBeenCalledWith('Erro ao salvar transação.');
  });
});
