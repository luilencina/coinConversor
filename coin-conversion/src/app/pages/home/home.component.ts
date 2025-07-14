import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RatesComponent } from '../rates/rates.component';
import { ConversionComponent } from '../conversion/conversion.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { TransactionComponent } from '../transactions/transactions.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RatesComponent,
    ConversionComponent,
    MatGridListModule,
    TransactionComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
