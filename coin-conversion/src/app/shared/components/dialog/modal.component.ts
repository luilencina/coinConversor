import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonComponent } from '../button/button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, FormsModule, ButtonComponent, MatInputModule, MatDialogActions, MatDialogContent, MatDialogTitle],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
   rate: number;
   
   constructor(
     public dialogRef: MatDialogRef<ModalComponent>,
     @Inject(MAT_DIALOG_DATA) public data: { currentRate: number }
    ) {
      this.rate = data.currentRate;
    }

  save() {
    this.dialogRef.close(this.rate);
  }

  cancel() {
    this.dialogRef.close();
  }
}
