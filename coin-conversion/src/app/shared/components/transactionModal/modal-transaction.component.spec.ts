import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionModalComponent } from './moda-transaction.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { formatCurrency, formatDate } from '@angular/common';

describe('TransactionModalComponent', () => {
  let component: TransactionModalComponent;
  let fixture: ComponentFixture<TransactionModalComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<TransactionModalComponent>>;

  const mockData = {
    id: 'txn123',
    originCurrency: 'Ouro Real',
    destinationCurrency: 'Tibar',
    amount: 99.99,
    date: new Date('2024-07-14T15:00:00Z')
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        TransactionModalComponent,
        MatDialogModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the transaction data in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain(mockData.id);
    expect(compiled.textContent).toContain(mockData.originCurrency);
    expect(compiled.textContent).toContain(mockData.destinationCurrency);

    const formattedAmount = formatCurrency(mockData.amount, 'pt-BR', 'R$');
    expect(compiled.textContent).toContain(formattedAmount);

    const formattedDate = formatDate(mockData.date, 'short', 'pt-BR');
    expect(compiled.textContent).toContain(formattedDate);
  });

  it('should close the dialog when "Fechar" button is clicked', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click');
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
