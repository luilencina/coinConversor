import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RatesComponent } from './pages/rates/rates.component';
import { ConversionComponent } from './pages/conversion/conversion.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rates', component: RatesComponent },
  { path: 'conversion', component: ConversionComponent },

];
