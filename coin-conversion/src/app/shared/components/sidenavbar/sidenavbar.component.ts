import { Component, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.services';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.scss']
})
export class NavbarComponent {

    isDarkMode = computed(() => this.theme.isDarkMode());

  constructor(private theme: ThemeService) { }

  toggleTheme() {
    this.theme.toggleTheme();
  }
 }
