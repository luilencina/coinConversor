import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RatesComponent } from './rates.component';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { of } from 'rxjs';

class MockExchangeRateService {
  private rate = 10;
  getRate() {
    return this.rate;
  }
  setRate(newRate: number) {
    this.rate = newRate;
  }
}

class MockMatDialogRef {
  afterClosed() {
    return of(42);
  }
}

describe('RatesComponent', () => {
  let component: RatesComponent;
  let fixture: ComponentFixture<RatesComponent>;
  let exchangeRateService: ExchangeRateService;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatesComponent, MatDialogModule],
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
