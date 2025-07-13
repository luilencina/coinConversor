export interface Transaction {
  id?: string;
  originCurrency: string;
  destinationCurrency: string;
  amount: number;
  date: Date;
}
