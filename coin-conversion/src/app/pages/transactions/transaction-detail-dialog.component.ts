import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../core/services/transaction.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-transaction-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ButtonComponent],
  template: `
    <h2 mat-dialog-title>Detalhes da Transação</h2>
    <mat-dialog-content class="mat-typography">
      <p><strong>ID:</strong> {{ data.id || 'N/A' }}</p>
      <p><strong>Origem:</strong> {{ data.originCurrency }}</p>
      <p><strong>Destino:</strong> {{ data.destinationCurrency }}</p>
      <p><strong>Valor:</strong> {{ data.amount }}</p>
      <p><strong>Data/Hora:</strong> {{ convertTimestamp(data.date) | date:'medium' }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <app-button mat-dialog-close label="Fechar"/>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content p {
      margin: 8px 0;
    }
  `]
})
export class TransactionDetailDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Transaction,
    private dialogRef: MatDialogRef<TransactionDetailDialogComponent>
  ) {}

  close() {
    this.dialogRef.close();
  }

  convertTimestamp(ts: any): Date | null {
    if (!ts) return null;

    if (ts.seconds !== undefined && ts.nanoseconds !== undefined) {
      return new Date(ts.seconds * 1000 + ts.nanoseconds / 1e6);
    }

    if (typeof ts === 'string' || ts instanceof Date) {
      return new Date(ts);
    }

    return null;
  }

}
