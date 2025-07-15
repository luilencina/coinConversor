import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ButtonComponent],
  template: `
    <h2 mat-dialog-title>{{ data.title || 'Aviso' }}</h2>
    <mat-dialog-content class="mat-typography">
      <div *ngIf="data.bodyHtml; else plainText" [innerHTML]="data.bodyHtml"></div>
      <ng-template #plainText>
        <p>{{ data.bodyText || '' }}</p>
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <app-button
        *ngIf="data.onlyCloseButton"
        (clicked)="onClose()"
        label="Fechar"
      ></app-button>
      <ng-container *ngIf="!data.onlyCloseButton">
        <app-button (clicked)="onCancel()" label="Cancelar"></app-button>
        <app-button color="warn" (clicked)="onConfirm()" label="Confirmar"></app-button>
      </ng-container>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title?: string;
      bodyText?: string;
      bodyHtml?: string;
      onlyCloseButton?: boolean;
    }
  ) {}

  onConfirm() {
    this.dialogRef.close(true);
  }
  onCancel() {
    this.dialogRef.close(false);
  }
  onClose() {
    this.dialogRef.close();
  }
}
