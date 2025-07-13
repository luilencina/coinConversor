import { Component, signal } from '@angular/core';
import { NavbarComponent } from './shared/components/sidenavbar/sidenavbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('coin-conversion');
}
