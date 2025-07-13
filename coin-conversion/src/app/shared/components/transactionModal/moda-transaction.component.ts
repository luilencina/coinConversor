import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-transaction-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Detalhes da Transação</h2>
    <mat-dialog-content>
      <p><strong>ID:</strong> {{ data.id }}</p>
      <p><strong>Moeda de Origem:</strong> {{ data.originCurrency }}</p>
      <p><strong>Moeda de Destino:</strong> {{ data.destinationCurrency }}</p>
      <p><strong>Valor:</strong> {{ data.amount | currency }}</p>
      <p><strong>Data/Hora:</strong> {{ data.date | date: 'short' }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Fechar</button>
    </mat-dialog-actions>
  `,
})
export class TransactionModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TransactionModalComponent>
  ) {}
}
