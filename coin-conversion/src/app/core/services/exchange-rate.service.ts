import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  private rate = 2.5;

  getRate(): number {
    return this.rate;
  }

  setRate(newRate: number) {
    this.rate = newRate;
  }
}
