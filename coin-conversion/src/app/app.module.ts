import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { HomeComponent } from './pages/home/home.component';
import { RatesComponent } from './pages/rates/rates.component';
import { ButtonComponent } from './shared/components/button/button.component';

@NgModule({
  imports: [
    BrowserModule,
    App,
    HomeComponent,
    RatesComponent,
    ButtonComponent,
  ],
})
export class AppModule { }
