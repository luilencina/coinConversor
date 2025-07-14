import 'zone.js';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RatesComponent } from './rates.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/dialog/modal.component';

class MockExchangeRateService {
  private rate = 10;
  getRate() {
    return this.rate;
  }
  setRate(newRate: number) {
    this.rate = newRate;
  }
}

describe('RatesComponent', () => {
  let component: RatesComponent;
  let fixture: ComponentFixture<RatesComponent>;
  let exchangeRateService: ExchangeRateService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RatesComponent,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        ButtonComponent,
        ModalComponent // <- ESSENCIAL!
      ],
      providers: [
        { provide: ExchangeRateService, useClass: MockExchangeRateService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RatesComponent);
    component = fixture.componentInstance;
    exchangeRateService = TestBed.inject(ExchangeRateService);
    dialog = TestBed.inject(MatDialog);
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize newRate with service rate on ngOnInit', () => {
    component.ngOnInit();
    expect(component.newRate).toBe(exchangeRateService.getRate());
  });

  it('should open modal and update newRate on close', fakeAsync(() => {
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(42)
    } as MatDialogRef<any>);

    const setRateSpy = spyOn(exchangeRateService, 'setRate').and.callThrough();

    component.newRate = 10;
    component.openModal();

    tick();

    expect(dialog.open).toHaveBeenCalled();
    expect(component.newRate).toBe(42);
    expect(setRateSpy).toHaveBeenCalledWith(42);
  }));

  it('should not update newRate if modal returns undefined', fakeAsync(() => {
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(undefined)
    } as MatDialogRef<any>);

    const setRateSpy = spyOn(exchangeRateService, 'setRate');

    component.newRate = 10;
    component.openModal();
    tick();

    expect(component.newRate).toBe(10);
    expect(setRateSpy).not.toHaveBeenCalled();
  }));
});
