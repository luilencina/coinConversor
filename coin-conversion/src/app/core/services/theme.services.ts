import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dark-mode');
      this.darkMode.set(stored === 'true');

      if (this.darkMode()) document.body.classList.add('dark-mode');
      
    }
  }

  toggleTheme() {
    this.darkMode.set(!this.darkMode());
    if (typeof window !== 'undefined') {
      this.darkMode() ? document.body.classList.add('dark-mode') : document.body.classList.remove('dark-mode')
      localStorage.setItem('dark-mode', this.darkMode().toString());
    }
  }

  isDarkMode() {
    return this.darkMode.asReadonly();
  }
}
