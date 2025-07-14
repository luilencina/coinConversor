import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { ModalComponent } from '../../shared/components/dialog/modal.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-rates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ButtonComponent
  ],
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit {
  newRate!: number;
  private dialog = inject(MatDialog);
  private exchangeRateService = inject(ExchangeRateService);

  ngOnInit(): void {
    this.newRate = this.exchangeRateService.getRate();
  }

  openModal() {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: { currentRate: this.newRate },
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result: number | undefined) => {
      if (result !== undefined) {
        this.newRate = result;
        this.exchangeRateService.setRate(this.newRate);
      }
    });
  }
}
