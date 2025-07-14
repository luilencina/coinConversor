import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Firestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  collectionData
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

export interface Transaction {
  id?: string;
  originCurrency: string;
  destinationCurrency: string;
  amount: number;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private firestore: Firestore | null = null;
  private collectionName = 'transactions';
  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.firestore = inject(Firestore);
    }
  }

  addTransaction(transaction: Transaction): Promise<any> {
    if (!this.firestore) {
      return Promise.reject('Firestore não disponível no servidor.');
    }
    const coll = collection(this.firestore, this.collectionName);
    return addDoc(coll, transaction);
  }

  deleteTransaction(id: string): Promise<void> {
    if (!this.firestore) {
      return Promise.reject('Firestore not available on the server.');
    }
    const docRef = doc(this.firestore, `${this.collectionName}/${id}`);
    return deleteDoc(docRef);
  }

  getTransactions(): Observable<Transaction[]> {
    if (!this.firestore) return of([]);
    const coll = collection(this.firestore, this.collectionName);
    return collectionData(coll, { idField: 'id' }) as Observable<Transaction[]>;
  }

}
