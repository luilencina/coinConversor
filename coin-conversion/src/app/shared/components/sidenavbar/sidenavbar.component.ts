import { Component, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.services';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ButtonComponent],
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
