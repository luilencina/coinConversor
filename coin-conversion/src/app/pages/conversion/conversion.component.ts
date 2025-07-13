import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';

@Component({
  selector: 'app-conversion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './conversion.component.html',
  styleUrls: ['./conversion.component.scss']
})
export class ConversionComponent {
  currencies = ['Ouro Real', 'Tibar'];

  originCurrency = 'Ouro Real';
  amount: number | null = null;
  convertedValue: number | null = null;

  constructor(private exchangeRate: ExchangeRateService) {}

  convert() {
    const rate = this.exchangeRate.getRate();

    if (this.amount == null) {
      this.convertedValue = null;
      return;
    }

    this.convertedValue =
      this.originCurrency === 'Ouro Real'
        ? this.amount * rate
        : this.amount / rate;
  }
}
